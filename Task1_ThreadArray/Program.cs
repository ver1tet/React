using System;
using System.Linq;
using System.Threading;

namespace Task1_ThreadArray
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Створення масиву з 100 випадкових чисел...");
            Random rnd = new Random();
            int[] numbers = Enumerable.Range(0, 100).Select(x => rnd.Next(1, 1000)).ToArray();

            int max = 0;
            int min = 0;
            double avg = 0;

            Thread maxThread = new Thread(() =>
            {
                max = numbers.Max();
                Console.WriteLine($"Потік (Максимум): Найбільше число = {max}");
            });

            Thread minThread = new Thread(() =>
            {
                min = numbers.Min();
                Console.WriteLine($"Потік (Мінімум): Найменше число = {min}");
            });

            Thread avgThread = new Thread(() =>
            {
                avg = numbers.Average();
                Console.WriteLine($"Потік (Середнє арифметичне): Середнє значення = {avg:F2}");
            });

            maxThread.Start();
            minThread.Start();
            avgThread.Start();

            maxThread.Join();
            minThread.Join();
            avgThread.Join();

            Console.WriteLine("Всі потоки завершили роботу.");
        }
    }
}
