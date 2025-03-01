import sympy
from sympy import randprime

def generate_prime(bits: int):
    # 2^(bits-1) <= p < 2^bits
    lower_bound = 2**(bits - 1)
    upper_bound = 2**bits - 1
    return randprime(lower_bound, upper_bound)

prime_512 = generate_prime(1024)
print(sympy.isprime(prime_512))
print("Số nguyên tố :", prime_512)
