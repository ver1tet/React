using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Collections.Concurrent;

namespace Exam_Task1_WordSearch
{
    public partial class MainForm : Form
    {
        private TextBox txtWords;
        private TextBox txtDestFolder;
        private Button btnStart, btnPause, btnResume, btnStop;
        private ProgressBar progressBar;
        private ListBox lstResults;
        private Label lblStatus;

        private CancellationTokenSource? cts;
        private ManualResetEvent pauseEvent = new ManualResetEvent(true);
        private bool isRunning = false;
        private int filesScanned = 0;

        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "Пошук заборонених слів";
            this.Size = new System.Drawing.Size(600, 480);

            Label lbl1 = new Label() { Text = "Заборонені слова (через кому):", Top = 10, Left = 10, Width = 200 };
            txtWords = new TextBox() { Top = 10, Left = 220, Width = 350 };
            
            Label lbl2 = new Label() { Text = "Папка призначення:", Top = 40, Left = 10, Width = 200 };
            txtDestFolder = new TextBox() { Top = 40, Left = 220, Width = 350, Text = "C:\\CopiedInfectedFiles" };

            btnStart = new Button() { Text = "Старт", Top = 70, Left = 10, Width = 80 };
            btnPause = new Button() { Text = "Пауза", Top = 70, Left = 100, Width = 80, Enabled = false };
            btnResume = new Button() { Text = "Відновити", Top = 70, Left = 190, Width = 80, Enabled = false };
            btnStop = new Button() { Text = "Зупинити", Top = 70, Left = 280, Width = 80, Enabled = false };

            btnStart.Click += BtnStart_Click;
            btnPause.Click += BtnPause_Click;
            btnResume.Click += BtnResume_Click;
            btnStop.Click += BtnStop_Click;

            progressBar = new ProgressBar() { Top = 110, Left = 10, Width = 560, Style = ProgressBarStyle.Marquee };
            progressBar.Visible = false;

            lblStatus = new Label() { Top = 140, Left = 10, Width = 560 };
            
            lstResults = new ListBox() { Top = 170, Left = 10, Width = 560, Height = 250 };

            this.Controls.AddRange(new Control[] { lbl1, txtWords, lbl2, txtDestFolder, btnStart, btnPause, btnResume, btnStop, progressBar, lblStatus, lstResults });
        }

        private async void BtnStart_Click(object sender, EventArgs e)
        {
            string words = txtWords.Text;
            if (string.IsNullOrWhiteSpace(words))
            {
                MessageBox.Show("Введіть заборонені слова.");
                return;
            }

            string destFolder = txtDestFolder.Text;
            if (!Directory.Exists(destFolder))
            {
                try { Directory.CreateDirectory(destFolder); }
                catch (Exception ex) { MessageBox.Show("Помилка створення папки: " + ex.Message); return; }
            }

            var forbiddenWords = words.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                      .Select(w => w.Trim().ToLower()).ToList();

            btnStart.Enabled = false;
            btnPause.Enabled = true;
            btnStop.Enabled = true;
            progressBar.Visible = true;
            lstResults.Items.Clear();
            lblStatus.Text = "Шукаємо...";
            filesScanned = 0;

            cts = new CancellationTokenSource();
            pauseEvent.Set();
            isRunning = true;

            try
            {
                await Task.Run(() => PerformSearch(forbiddenWords, destFolder, cts.Token));
                lblStatus.Text = $"Пошук завершено. Перевірено файлів: {filesScanned}";
            }
            catch (OperationCanceledException)
            {
                lblStatus.Text = "Пошук скасовано.";
            }
            catch (Exception ex)
            {
                lblStatus.Text = $"Помилка: {ex.Message}";
            }
            finally
            {
                isRunning = false;
                btnStart.Enabled = true;
                btnPause.Enabled = false;
                btnResume.Enabled = false;
                btnStop.Enabled = false;
                progressBar.Visible = false;
            }
        }

        private void BtnPause_Click(object sender, EventArgs e)
        {
            if (isRunning)
            {
                pauseEvent.Reset();
                btnPause.Enabled = false;
                btnResume.Enabled = true;
                lblStatus.Text = "Пауза...";
            }
        }

        private void BtnResume_Click(object sender, EventArgs e)
        {
            if (isRunning)
            {
                pauseEvent.Set();
                btnPause.Enabled = true;
                btnResume.Enabled = false;
                lblStatus.Text = "Шукаємо...";
            }
        }

        private void BtnStop_Click(object sender, EventArgs e)
        {
            if (isRunning && cts != null)
            {
                cts.Cancel();
                pauseEvent.Set();
            }
        }

        private void PerformSearch(List<string> forbiddenWords, string destFolder, CancellationToken token)
        {
            var drives = DriveInfo.GetDrives().Where(d => d.IsReady && d.DriveType == DriveType.Fixed);
            var reportStats = new ConcurrentDictionary<string, int>();
            int totalReplaced = 0;
            
            // Generate report content in memory to avoid locking issues with parallel search
            var reportLines = new ConcurrentBag<string>();
            
            Parallel.ForEach(drives, new ParallelOptions { CancellationToken = token }, drive => 
            {
                SearchDirectory(drive.RootDirectory.FullName, forbiddenWords, destFolder, token, reportLines, reportStats, ref totalReplaced);
            });

            string reportPath = Path.Combine(destFolder, "report.txt");
            using (StreamWriter reportWriter = new StreamWriter(reportPath))
            {
                foreach(var line in reportLines)
                {
                    reportWriter.WriteLine(line);
                }

                reportWriter.WriteLine("=== ТОП 10 Заборонених слів ===");
                var top10 = reportStats.OrderByDescending(kvp => kvp.Value).Take(10);
                foreach (var item in top10)
                {
                    reportWriter.WriteLine($"{item.Key}: {item.Value}");
                }
                reportWriter.WriteLine($"Загальна кількість замін: {totalReplaced}");
            }
        }

        private void SearchDirectory(string dir, List<string> forbiddenWords, string destFolder, CancellationToken token, ConcurrentBag<string> reportLines, ConcurrentDictionary<string, int> reportStats, ref int totalReplaced)
        {
            token.ThrowIfCancellationRequested();
            pauseEvent.WaitOne();

            try
            {
                foreach (string file in Directory.GetFiles(dir, "*.txt"))
                {
                    token.ThrowIfCancellationRequested();
                    pauseEvent.WaitOne();
                    Interlocked.Increment(ref filesScanned);
                    
                    if (filesScanned % 100 == 0)
                    {
                        this.Invoke(new MethodInvoker(() => { if (lblStatus.Text.StartsWith("Шукаємо")) lblStatus.Text = $"Шукаємо... (перевірено {filesScanned})"; }));
                    }

                    ProcessFile(file, forbiddenWords, destFolder, reportLines, reportStats, ref totalReplaced);
                }

                foreach (string subDir in Directory.GetDirectories(dir))
                {
                    SearchDirectory(subDir, forbiddenWords, destFolder, token, reportLines, reportStats, ref totalReplaced);
                }
            }
            catch (UnauthorizedAccessException) { }
            catch (Exception) { }
        }

        private void ProcessFile(string filePath, List<string> forbiddenWords, string destFolder, ConcurrentBag<string> reportLines, ConcurrentDictionary<string, int> reportStats, ref int totalReplaced)
        {
            try
            {
                string content = File.ReadAllText(filePath);
                bool found = false;
                int replacementsInFile = 0;

                foreach (var fw in forbiddenWords)
                {
                    int index = 0;
                    while ((index = content.IndexOf(fw, index, StringComparison.OrdinalIgnoreCase)) != -1)
                    {
                        found = true;
                        replacementsInFile++;
                        reportStats.AddOrUpdate(fw, 1, (key, oldValue) => oldValue + 1);
                        index += fw.Length;
                    }
                }

                if (found)
                {
                    string safeFileName = Guid.NewGuid().ToString().Substring(0, 8) + "_" + Path.GetFileName(filePath);
                    string originalCopy = Path.Combine(destFolder, safeFileName);
                    string modifiedCopy = Path.Combine(destFolder, "MOD_" + safeFileName);

                    File.Copy(filePath, originalCopy, true);

                    string modifiedContent = content;
                    foreach (var fw in forbiddenWords)
                    {
                        modifiedContent = modifiedContent.Replace(fw, "*******", StringComparison.OrdinalIgnoreCase);
                    }
                    File.WriteAllText(modifiedCopy, modifiedContent);

                    FileInfo fi = new FileInfo(filePath);
                    reportLines.Add($"Файл: {filePath} | Розмір: {fi.Length} байт | Замін: {replacementsInFile}");
                    
                    Interlocked.Add(ref totalReplaced, replacementsInFile);
                    
                    this.Invoke(new MethodInvoker(() =>
                    {
                        lstResults.Items.Add($"Знайдено та скопійовано: {filePath}");
                    }));
                }
            }
            catch { }
        }
    }
}
