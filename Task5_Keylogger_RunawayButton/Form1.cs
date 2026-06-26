using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Task5_Keylogger_RunawayButton
{
    public partial class Form1 : Form
    {
        // Keyboard hook constants
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private const int WM_KEYUP = 0x0101;
        private const int WM_SYSKEYDOWN = 0x0104;

        // Mouse hook constants
        private const int WH_MOUSE_LL = 14;
        private const int WM_LBUTTONDOWN = 0x0201;

        private LowLevelKeyboardProc _kbdProc;
        private IntPtr _kbdHookID = IntPtr.Zero;

        private LowLevelMouseProc _mouseProc;
        private IntPtr _mouseHookID = IntPtr.Zero;

        private bool _isLogging = false;
        private string _logFilePath = "keylog.txt";

        private TextBox txtTest;
        private Button btnToggleLogging;
        private Button btnRunaway;

        private Random _rnd = new Random();

        public Form1()
        {
            InitializeComponentCustom();
            _kbdProc = KeyboardHookCallback;
            _mouseProc = MouseHookCallback;
        }

        private void InitializeComponentCustom()
        {
            this.Text = "Хуки: Логгер клавіатури та Кнопка-втікач";
            this.Size = new Size(600, 400);

            txtTest = new TextBox() { Top = 20, Left = 20, Width = 300, Multiline = true, Height = 100 };
            btnToggleLogging = new Button() { Text = "Старт логування", Top = 140, Left = 20, Width = 150 };
            btnToggleLogging.Click += BtnToggleLogging_Click;

            btnRunaway = new Button() { Text = "Спробуй натисни!", Top = 200, Left = 200, Width = 120, Height = 40, BackColor = Color.LightCoral };

            this.Controls.Add(txtTest);
            this.Controls.Add(btnToggleLogging);
            this.Controls.Add(btnRunaway);

            this.Load += Form1_Load;
            this.FormClosing += Form1_FormClosing;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            _kbdHookID = SetHook(WH_KEYBOARD_LL, _kbdProc);
            _mouseHookID = SetHook(WH_MOUSE_LL, _mouseProc);
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            UnhookWindowsHookEx(_kbdHookID);
            UnhookWindowsHookEx(_mouseHookID);
        }

        private void BtnToggleLogging_Click(object sender, EventArgs e)
        {
            _isLogging = !_isLogging;
            btnToggleLogging.Text = _isLogging ? "Стоп логування" : "Старт логування";
        }

        private IntPtr SetHook(int idHook, Delegate proc)
        {
            using (Process curProcess = Process.GetCurrentProcess())
            using (ProcessModule curModule = curProcess.MainModule)
            {
                return SetWindowsHookEx(idHook, Marshal.GetFunctionPointerForDelegate(proc),
                    GetModuleHandle(curModule.ModuleName), 0);
            }
        }

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);
        private delegate IntPtr LowLevelMouseProc(int nCode, IntPtr wParam, IntPtr lParam);

        private IntPtr KeyboardHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && _isLogging)
            {
                if (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)WM_SYSKEYDOWN)
                {
                    int vkCode = Marshal.ReadInt32(lParam);
                    Keys key = (Keys)vkCode;
                    
                    try
                    {
                        using (StreamWriter sw = File.AppendText(_logFilePath))
                        {
                            sw.Write($"[{key}] ");
                        }
                    }
                    catch { } // Ignore file write errors for simplicity
                }
            }
            return CallNextHookEx(_kbdHookID, nCode, wParam, lParam);
        }

        private IntPtr MouseHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && wParam == (IntPtr)WM_LBUTTONDOWN)
            {
                MSLLHOOKSTRUCT hookStruct = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
                Point screenPt = hookStruct.pt;
                
                // Get button bounds in screen coordinates
                Rectangle btnBounds = btnRunaway.RectangleToScreen(btnRunaway.ClientRectangle);

                if (btnBounds.Contains(screenPt))
                {
                    // Block the click
                    this.Invoke(new MethodInvoker(() =>
                    {
                        MoveRunawayButton();
                    }));
                    return (IntPtr)1; // Block input
                }
            }
            return CallNextHookEx(_mouseHookID, nCode, wParam, lParam);
        }

        private void MoveRunawayButton()
        {
            int maxX = this.ClientSize.Width - btnRunaway.Width;
            int maxY = this.ClientSize.Height - btnRunaway.Height;
            
            if (maxX > 0 && maxY > 0)
            {
                btnRunaway.Left = _rnd.Next(0, maxX);
                btnRunaway.Top = _rnd.Next(0, maxY);
            }
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct POINT
        {
            public int X;
            public int Y;
            public static implicit operator Point(POINT p) => new Point(p.X, p.Y);
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct MSLLHOOKSTRUCT
        {
            public POINT pt;
            public uint mouseData;
            public uint flags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

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
