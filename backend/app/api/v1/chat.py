from datetime import datetime
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, Body
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.api.v1 import deps
from app.schemas import chat as chat_schema
from app.services.chat_service import chat_service
from app.schemas.user import User

router = APIRouter()

@router.get("/conversations", response_model=List[chat_schema.Conversation])
async def list_conversations(
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    # Fetch all conversations for user, sort by updated_at desc
    cursor = db.conversations.find({"user_id": current_user.id}).sort("updated_at", -1)
    
    conversations = []
    async for conv in cursor:
        conv["id"] = str(conv["_id"])
        # Optional: truncate messages for summary
        conversations.append(conv)
    return conversations

@router.post("/conversations", response_model=chat_schema.Conversation)
async def create_conversation(
    conversation_in: chat_schema.ConversationCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    new_conversation = {
        "user_id": current_user.id,
        "title": conversation_in.title,
        "messages": [],
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    result = await db.conversations.insert_one(new_conversation)
    new_conversation["id"] = str(result.inserted_id)
    return new_conversation

@router.get("/conversations/{conversation_id}", response_model=chat_schema.Conversation)
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    try:
        obj_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    conversation = await db.conversations.find_one({"_id": obj_id, "user_id": current_user.id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    conversation["id"] = str(conversation["_id"])
    return conversation

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    try:
        obj_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await db.conversations.delete_one({"_id": obj_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    return {"status": "success", "message": "Conversation deleted"}

@router.post("/message", response_model=chat_schema.ChatResponse)
async def send_message(
    chat_req: chat_schema.ChatRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    user_msg_content = chat_req.content
    conversation_id = chat_req.conversation_id

    # Validate: reject empty or whitespace-only messages
    if not user_msg_content or not user_msg_content.strip():
        raise HTTPException(status_code=422, detail="Message content cannot be empty")
    user_msg_content = user_msg_content.strip()
    
    # If no conversation ID, create a new one automatically
    if not conversation_id:
        # Create new conv
        # Auto-title logic: first 30 chars of content
        title = (user_msg_content[:30] + '...') if len(user_msg_content) > 30 else user_msg_content
        new_conv = {
            "user_id": current_user.id,
            "title": title,
            "messages": [],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        res = await db.conversations.insert_one(new_conv)
        conversation_id = str(res.inserted_id)
    
    # Get history
    try:
        obj_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid and Conversation ID format")

    conversation = await db.conversations.find_one({"_id": obj_id, "user_id": current_user.id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    history_messages = conversation.get("messages", [])
    
    # Detect language from user message for storage
    user_lang = chat_service._detect_language(user_msg_content)

    # Auto-update title if still "New Chat" or empty (first message se title set karo)
    smart_title = (user_msg_content[:35] + '...') if len(user_msg_content) > 35 else user_msg_content
    update_fields = {"updated_at": datetime.now()}
    if conversation.get("title", "New Chat") in ("New Chat", "", None):
        update_fields["title"] = smart_title

    # 1. Save User Message
    user_msg = {
        "role": "user",
        "content": user_msg_content,
        "language": user_lang,
        "timestamp": datetime.now()
    }

    await db.conversations.update_one(
        {"_id": obj_id},
        {"$push": {"messages": user_msg}, "$set": update_fields}
    )
    
    # 2. Process with AI (with DB knowledge context)
    # Normalize history: bot messages may have dict content (stored structured data)
    # — extract just the 'reply' text for AI context, not the full JSON blob.
    normalized_history = []
    for m in history_messages:
        content = m.get("content", "")
        if isinstance(content, dict):
            # Extract plain reply text for history context
            content = content.get("reply") or content.get("message") or str(content)
        normalized_history.append(
            chat_schema.Message(role=m["role"], content=content, language=m.get("language", "en"))
        )

    ai_response_dict = await chat_service.active_chat_processing(
        user_input=user_msg_content,
        history=normalized_history,
        db=db,  # Pass DB so knowledge_service can fetch verified data
        specific_lang=chat_req.language
    )
    detected_lang = ai_response_dict.get("lang", "en")
    
    # 3. Save Assistant Message
    assistant_msg = {
        "role": "assistant",
        "content": ai_response_dict, # Store full JSON object to persist cards
        "language": detected_lang, 
        "timestamp": datetime.now()
    }
    
    await db.conversations.update_one(
        {"_id": obj_id},
        {"$push": {"messages": assistant_msg}, "$set": {"updated_at": datetime.now()}}
    )
    
    return {
        "conversation_id": conversation_id,
        "reply": ai_response_dict.get("reply", ""),
        "data": ai_response_dict, # full structured data
        "language": detected_lang,
        "title": update_fields.get("title", conversation.get("title", "New Chat"))  # Return updated title
    }

