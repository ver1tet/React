using System;
using System.Threading;
using System.Windows.Forms;

namespace Exam_Task1_WordSearch
{
    static class Program
    {
        static Mutex mutex = new Mutex(true, "{8F6F0AC4-B9A1-45fd-A8CF-72F04E6BDE8F}");

        [STAThread]
        static void Main(string[] args)
        {
            if (mutex.WaitOne(TimeSpan.Zero, true))
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                if (args.Length > 0)
                {
                    Console.WriteLine("Running in console mode without UI...");
                }
                else
                {
                    Application.Run(new MainForm());
                }
                mutex.ReleaseMutex();
            }
            else
            {
                MessageBox.Show("Додаток вже запущено!", "Помилка", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }
    }
}
