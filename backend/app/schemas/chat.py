from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: Any # str or dict
    language: Optional[str] = "en"  # "en", "hi", "gu"
    timestamp: datetime = datetime.now()

class ConversationBase(BaseModel):
    title: str

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase):
    id: str
    user_id: str
    messages: List[Message] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    content: str
    language: Optional[str] = None # force response language

class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    data: Optional[Dict[str, Any]] = None  # structured travel data
    language: str = "en"
    title: Optional[str] = None  # Updated title after first message
