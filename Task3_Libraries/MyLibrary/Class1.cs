using System;

namespace MyLibrary
{
    // Завдання 1
    public class MessageHelper
    {
        public static void ShowInfoMessage(string message)
        {
            Console.WriteLine($"[INFO]: {message}");
        }
    }

    // Завдання 2
    public class MathHelper
    {
        public static long Factorial(int n)
        {
            if (n < 0) throw new ArgumentException("Число має бути невід'ємним.");
            if (n == 0 || n == 1) return 1;
            long result = 1;
            for (int i = 2; i <= n; i++)
            {
                result *= i;
            }
            return result;
        }

        public static bool IsPrime(int n)
        {
            if (n <= 1) return false;
            if (n == 2) return true;
            if (n % 2 == 0) return false;
            for (int i = 3; i <= Math.Sqrt(n); i += 2)
            {
                if (n % i == 0) return false;
            }
            return true;
        }

        public static bool IsEven(int n)
        {
            return n % 2 == 0;
        }

        public static bool IsOdd(int n)
        {
            return n % 2 != 0;
        }
    }

    // Завдання 3
    public class Fraction
    {
        public int Numerator { get; private set; }
        public int Denominator { get; private set; }

        public Fraction(int numerator, int denominator)
        {
            if (denominator == 0) throw new ArgumentException("Знаменник не може бути нулем.");
            Numerator = numerator;
            Denominator = denominator;
            Simplify();
        }

        private void Simplify()
        {
            int gcd = GCD(Math.Abs(Numerator), Math.Abs(Denominator));
            Numerator /= gcd;
            Denominator /= gcd;
            if (Denominator < 0)
            {
                Numerator = -Numerator;
                Denominator = -Denominator;
            }
        }

        private int GCD(int a, int b)
        {
            while (b != 0)
            {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        public Fraction Add(Fraction other)
        {
            int newNumerator = Numerator * other.Denominator + other.Numerator * Denominator;
            int newDenominator = Denominator * other.Denominator;
            return new Fraction(newNumerator, newDenominator);
        }

        public Fraction Subtract(Fraction other)
        {
            int newNumerator = Numerator * other.Denominator - other.Numerator * Denominator;
            int newDenominator = Denominator * other.Denominator;
            return new Fraction(newNumerator, newDenominator);
        }

        public Fraction Multiply(Fraction other)
        {
            return new Fraction(Numerator * other.Numerator, Denominator * other.Denominator);
        }

        public Fraction Divide(Fraction other)
        {
            if (other.Numerator == 0) throw new DivideByZeroException("Ділення на нуль.");
            return new Fraction(Numerator * other.Denominator, Denominator * other.Numerator);
        }

        public override string ToString()
        {
            if (Denominator == 1) return Numerator.ToString();
            return $"{Numerator}/{Denominator}";
        }
    }
}
