using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Task2_WinFormsApp
{
    public partial class Form1 : Form
    {
        private TextBox txtExtension;
        private TextBox txtDirectory;
        private Button btnStart;
        private Label lblResult;

        public Form1()
        {
            InitializeComponentCustom();
        }

        private void InitializeComponentCustom()
        {
            this.Text = "Пошук файлів";
            this.Size = new System.Drawing.Size(400, 300);

            Label lblExt = new Label() { Text = "Розширення (напр. .txt):", Top = 20, Left = 20, Width = 150 };
            txtExtension = new TextBox() { Top = 20, Left = 180, Width = 180 };

            Label lblDir = new Label() { Text = "Шлях до каталогу:", Top = 60, Left = 20, Width = 150 };
            txtDirectory = new TextBox() { Top = 60, Left = 180, Width = 180 };

            btnStart = new Button() { Text = "Почати", Top = 100, Left = 180, Width = 100 };
            btnStart.Click += BtnStart_Click;

            lblResult = new Label() { Top = 140, Left = 20, Width = 340, Height = 100, AutoSize = false };

            this.Controls.Add(lblExt);
            this.Controls.Add(txtExtension);
            this.Controls.Add(lblDir);
            this.Controls.Add(txtDirectory);
            this.Controls.Add(btnStart);
            this.Controls.Add(lblResult);
        }

        private async void BtnStart_Click(object sender, EventArgs e)
        {
            string ext = txtExtension.Text.Trim();
            string dir = txtDirectory.Text.Trim();

            if (string.IsNullOrEmpty(ext) || string.IsNullOrEmpty(dir))
            {
                MessageBox.Show("Будь ласка, введіть розширення та шлях до каталогу.");
                return;
            }

            if (!ext.StartsWith(".")) ext = "." + ext;

            if (!Directory.Exists(dir))
            {
                MessageBox.Show("Вказаний каталог не існує.");
                return;
            }

            btnStart.Enabled = false;
            lblResult.Text = "Обчислення...";

            try
            {
                // Послідовний пошук
                Stopwatch swSeq = Stopwatch.StartNew();
                int countSeq = CountFilesSequential(dir, ext);
                swSeq.Stop();

                // Паралельний пошук
                Stopwatch swPar = Stopwatch.StartNew();
                int countPar = await Task.Run(() => CountFilesParallel(dir, ext));
                swPar.Stop();

                lblResult.Text = $"Знайдено файлів: {countSeq}\n" +
                                 $"Час (послідовно): {swSeq.ElapsedMilliseconds} мс\n" +
                                 $"Час (паралельно): {swPar.ElapsedMilliseconds} мс";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Помилка: {ex.Message}");
                lblResult.Text = "";
            }
            finally
            {
                btnStart.Enabled = true;
            }
        }

        private int CountFilesSequential(string path, string extension)
        {
            try
            {
                var files = Directory.EnumerateFiles(path, $"*{extension}", SearchOption.AllDirectories);
                return files.Count();
            }
            catch (UnauthorizedAccessException)
            {
                // Ігноруємо папки, до яких немає доступу
                return 0; 
            }
        }

        private int CountFilesParallel(string path, string extension)
        {
            try
            {
                 // Використовуємо AsParallel для паралельної обробки
                 var files = Directory.EnumerateFiles(path, $"*{extension}", SearchOption.AllDirectories).AsParallel();
                 return files.Count();
            }
            catch (UnauthorizedAccessException)
            {
                 return 0;
            }
        }
    }
}
