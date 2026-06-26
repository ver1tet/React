using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Exam_Task2_Monitor
{
    public partial class MainForm : Form
    {
        private TabControl tabControl;
        private TabPage tabSetup, tabMonitor, tabReport;

        // Setup UI
        private CheckBox chkStats, chkModeration;
        private TextBox txtReportPath, txtForbiddenWords, txtForbiddenApps;
        private Button btnStartMonitoring;

        // Monitor UI
        private Label lblMonitoringStatus;
        private Button btnStopMonitoring;

        // Report UI
        private TextBox txtReportView;
        private Button btnLoadReport;

        // Monitoring State
        private bool isMonitoring = false;
        private System.Windows.Forms.Timer processTimer;
        private HashSet<int> knownProcesses = new HashSet<int>();

        // Hook
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private LowLevelKeyboardProc _kbdProc;
        private IntPtr _kbdHookID = IntPtr.Zero;
        private string typedBuffer = "";

        public MainForm()
        {
            InitializeComponent();
            _kbdProc = KeyboardHookCallback;
        }

        private void InitializeComponent()
        {
            this.Text = "Моніторинг та Модерування";
            this.Size = new Size(500, 450);

            tabControl = new TabControl() { Dock = DockStyle.Fill };
            tabSetup = new TabPage("Налаштування");
            tabMonitor = new TabPage("Моніторинг");
            tabReport = new TabPage("Звіт");

            // Setup
            chkStats = new CheckBox() { Text = "Статистика", Top = 20, Left = 20, Width = 100, Checked = true };
            chkModeration = new CheckBox() { Text = "Модерування", Top = 20, Left = 150, Width = 120, Checked = true };
            
            Label l1 = new Label() { Text = "Шлях до файлу звіту:", Top = 60, Left = 20, Width = 150 };
            txtReportPath = new TextBox() { Top = 60, Left = 180, Width = 250, Text = "report_monitor.txt" };

            Label l2 = new Label() { Text = "Заборонені слова (,):", Top = 100, Left = 20, Width = 150 };
            txtForbiddenWords = new TextBox() { Top = 100, Left = 180, Width = 250 };

            Label l3 = new Label() { Text = "Заборонені програми (,):", Top = 140, Left = 20, Width = 150 };
            txtForbiddenApps = new TextBox() { Top = 140, Left = 180, Width = 250 };

            btnStartMonitoring = new Button() { Text = "Запустити моніторинг", Top = 200, Left = 20, Width = 200 };
            btnStartMonitoring.Click += BtnStartMonitoring_Click;

            tabSetup.Controls.AddRange(new Control[] { chkStats, chkModeration, l1, txtReportPath, l2, txtForbiddenWords, l3, txtForbiddenApps, btnStartMonitoring });

            // Monitor
            lblMonitoringStatus = new Label() { Text = "Не працює", Top = 50, Left = 50, Width = 300, Font = new Font("Arial", 14) };
            btnStopMonitoring = new Button() { Text = "Зупинити", Top = 100, Left = 50, Width = 150 };
            btnStopMonitoring.Click += BtnStopMonitoring_Click;
            tabMonitor.Controls.AddRange(new Control[] { lblMonitoringStatus, btnStopMonitoring });

            // Report
            txtReportView = new TextBox() { Top = 50, Left = 10, Width = 450, Height = 300, Multiline = true, ScrollBars = ScrollBars.Vertical };
            btnLoadReport = new Button() { Text = "Завантажити звіт", Top = 10, Left = 10, Width = 150 };
            btnLoadReport.Click += BtnLoadReport_Click;
            tabReport.Controls.AddRange(new Control[] { btnLoadReport, txtReportView });

            tabControl.TabPages.Add(tabSetup);
            tabControl.TabPages.Add(tabMonitor);
            tabControl.TabPages.Add(tabReport);

            this.Controls.Add(tabControl);

            processTimer = new System.Windows.Forms.Timer();
            processTimer.Interval = 2000;
            processTimer.Tick += ProcessTimer_Tick;

            this.FormClosing += MainForm_FormClosing;
        }

        private void BtnStartMonitoring_Click(object sender, EventArgs e)
        {
            isMonitoring = true;
            _kbdHookID = SetHook(WH_KEYBOARD_LL, _kbdProc);
            
            knownProcesses.Clear();
            foreach (var p in Process.GetProcesses()) knownProcesses.Add(p.Id);
            
            processTimer.Start();

            tabControl.SelectedTab = tabMonitor;
            lblMonitoringStatus.Text = "Моніторинг увімкнено (приховано)";
        }

        private void BtnStopMonitoring_Click(object sender, EventArgs e)
        {
            isMonitoring = false;
            UnhookWindowsHookEx(_kbdHookID);
            processTimer.Stop();
            lblMonitoringStatus.Text = "Моніторинг зупинено";
            tabControl.SelectedTab = tabSetup;
        }

        private void BtnLoadReport_Click(object sender, EventArgs e)
        {
            string path = txtReportPath.Text;
            if (File.Exists(path))
            {
                txtReportView.Text = File.ReadAllText(path);
                
                if (File.Exists("moderation_" + path))
                {
                    txtReportView.Text += "\n\n=== МОДЕРАЦІЯ ===\n" + File.ReadAllText("moderation_" + path);
                }
            }
            else
            {
                txtReportView.Text = "Файл звіту не знайдено.";
            }
        }

        private void ProcessTimer_Tick(object sender, EventArgs e)
        {
            if (!isMonitoring) return;

            var currentProcesses = Process.GetProcesses();
            var forbiddenApps = txtForbiddenApps.Text.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                                     .Select(a => a.Trim().ToLower()).ToList();

            foreach (var p in currentProcesses)
            {
                if (!knownProcesses.Contains(p.Id))
                {
                    knownProcesses.Add(p.Id);
                    if (chkStats.Checked)
                    {
                        LogToFile(txtReportPath.Text, $"[ПРОЦЕС] Запущено: {p.ProcessName} о {DateTime.Now}");
                    }

                    if (chkModeration.Checked)
                    {
                        if (forbiddenApps.Any(fa => p.ProcessName.ToLower().Contains(fa)))
                        {
                            LogToFile("moderation_" + txtReportPath.Text, $"[БЛОКУВАННЯ] Процес {p.ProcessName} був закритий о {DateTime.Now}");
                            try { p.Kill(); } catch { }
                        }
                    }
                }
            }
        }

        private void LogToFile(string path, string text)
        {
            try { File.AppendAllText(path, text + Environment.NewLine); } catch { }
        }

        private IntPtr KeyboardHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN)
            {
                int vkCode = Marshal.ReadInt32(lParam);
                Keys key = (Keys)vkCode;

                if (chkStats.Checked)
                {
                    LogToFile(txtReportPath.Text, $"[КЛАВІША] Натиснуто: {key} о {DateTime.Now}");
                }

                if (chkModeration.Checked)
                {
                    if (key >= Keys.A && key <= Keys.Z)
                        typedBuffer += key.ToString().ToLower();
                    else if (key == Keys.Space || key == Keys.Enter || key == Keys.Back)
                        typedBuffer = "";

                    var forbiddenWords = txtForbiddenWords.Text.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                                               .Select(w => w.Trim().ToLower()).ToList();

                    foreach (var fw in forbiddenWords)
                    {
                        if (typedBuffer.EndsWith(fw))
                        {
                            LogToFile("moderation_" + txtReportPath.Text, $"[УВАГА] Виявлено заборонене слово: {fw} о {DateTime.Now}");
                            typedBuffer = "";
                        }
                    }
                }
            }
            return CallNextHookEx(_kbdHookID, nCode, wParam, lParam);
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (isMonitoring)
                UnhookWindowsHookEx(_kbdHookID);
        }

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr SetWindowsHookEx(int idHook, IntPtr lpfn, IntPtr hMod, uint dwThreadId);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool UnhookWindowsHookEx(IntPtr hhk);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern IntPtr GetModuleHandle(string lpModuleName);
    }
}
