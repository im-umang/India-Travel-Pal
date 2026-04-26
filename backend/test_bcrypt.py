import time
import bcrypt

def test_bcrypt():
    password = "Admin@123456"
    start = time.time()
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    gen_time = time.time() - start
    print(f"Bcrypt hash time: {gen_time:.4f}s")
    
    start = time.time()
    valid = bcrypt.checkpw(password.encode('utf-8'), hashed)
    check_time = time.time() - start
    print(f"Bcrypt verify time: {check_time:.4f}s")
    print(f"Valid: {valid}")

if __name__ == "__main__":
    test_bcrypt()
