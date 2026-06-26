using System;
using MyLibrary;

namespace TestApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("--- Завдання 1 ---");
            MessageHelper.ShowInfoMessage("Тестове повідомлення з DLL.");

            Console.WriteLine("\n--- Завдання 2 ---");
            int number = 5;
            Console.WriteLine($"Факторіал {number} = {MathHelper.Factorial(number)}");
            Console.WriteLine($"Число 7 просте? {MathHelper.IsPrime(7)}");
            Console.WriteLine($"Число 4 парне? {MathHelper.IsEven(4)}");
            Console.WriteLine($"Число 4 непарне? {MathHelper.IsOdd(4)}");

            Console.WriteLine("\n--- Завдання 3 ---");
            Fraction f1 = new Fraction(1, 2);
            Fraction f2 = new Fraction(1, 3);
            Console.WriteLine($"Дріб 1: {f1}");
            Console.WriteLine($"Дріб 2: {f2}");
            Console.WriteLine($"Сума: {f1.Add(f2)}");
            Console.WriteLine($"Різниця: {f1.Subtract(f2)}");
            Console.WriteLine($"Добуток: {f1.Multiply(f2)}");
            Console.WriteLine($"Частка: {f1.Divide(f2)}");
        }
    }
}
