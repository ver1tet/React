using System;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace Task4_HideWindow_CursorRestrict
{
    public partial class Form1 : Form
    {
        private const int WH_KEYBOARD_LL = 13;
        private const int WM_KEYDOWN = 0x0100;
        private const int WH_MOUSE_LL = 14;
        private const int WM_MOUSEMOVE = 0x0200;

        private LowLevelKeyboardProc _kbdProc;
        private IntPtr _kbdHookID = IntPtr.Zero;

        private LowLevelMouseProc _mouseProc;
        private IntPtr _mouseHookID = IntPtr.Zero;

        private bool _isHidden = false;
        private Rectangle _restrictedArea;
        private bool _isAltPressed = false;

        public Form1()
        {
            InitializeComponentCustom();
            _kbdProc = KeyboardHookCallback;
            _mouseProc = MouseHookCallback;
        }

        private void InitializeComponentCustom()
        {
            this.Text = "Хуки: Приховування вікна та Обмеження курсора";
            this.Size = new Size(500, 300);
            
            Label lblInfo = new Label();
            lblInfo.Text = "Ctrl + Shift + Q : Показати/Приховати вікно\nЗатисніть Alt : Обмежити курсор в центрі екрану (500x500)";
            lblInfo.Dock = DockStyle.Fill;
            lblInfo.TextAlign = ContentAlignment.MiddleCenter;
            lblInfo.Font = new Font("Arial", 12);
            this.Controls.Add(lblInfo);

            int screenW = Screen.PrimaryScreen.Bounds.Width;
            int screenH = Screen.PrimaryScreen.Bounds.Height;
            _restrictedArea = new Rectangle((screenW - 500) / 2, (screenH - 500) / 2, 500, 500);

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
            if (nCode >= 0)
            {
                int vkCode = Marshal.ReadInt32(lParam);
                Keys key = (Keys)vkCode;

                if (wParam == (IntPtr)WM_KEYDOWN)
                {
                    bool ctrl = (ModifierKeys & Keys.Control) == Keys.Control;
                    bool shift = (ModifierKeys & Keys.Shift) == Keys.Shift;

                    if (ctrl && shift && key == Keys.Q)
                    {
                        this.Invoke(new MethodInvoker(() =>
                        {
                            _isHidden = !_isHidden;
                            this.Visible = !_isHidden;
                        }));
                    }
                }
                
                // Track Alt key state for mouse restriction
                if (key == Keys.LMenu || key == Keys.RMenu || key == Keys.Alt)
                {
                    _isAltPressed = (wParam == (IntPtr)WM_KEYDOWN || wParam == (IntPtr)0x0104); // 0x0104 is WM_SYSKEYDOWN
                }
                // Handle release of Alt
                if (wParam == (IntPtr)0x0101 || wParam == (IntPtr)0x0105) // WM_KEYUP or WM_SYSKEYUP
                {
                     if (key == Keys.LMenu || key == Keys.RMenu || key == Keys.Alt)
                     {
                         _isAltPressed = false;
                     }
                }
            }
            return CallNextHookEx(_kbdHookID, nCode, wParam, lParam);
        }

        private IntPtr MouseHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
        {
            if (nCode >= 0 && wParam == (IntPtr)WM_MOUSEMOVE)
            {
                if (_isAltPressed || Control.ModifierKeys == Keys.Alt) // Fallback check
                {
                    MSLLHOOKSTRUCT hookStruct = (MSLLHOOKSTRUCT)Marshal.PtrToStructure(lParam, typeof(MSLLHOOKSTRUCT));
                    Point pt = hookStruct.pt;

                    if (!_restrictedArea.Contains(pt))
                    {
                        int newX = Math.Max(_restrictedArea.Left, Math.Min(pt.X, _restrictedArea.Right - 1));
                        int newY = Math.Max(_restrictedArea.Top, Math.Min(pt.Y, _restrictedArea.Bottom - 1));
                        
                        SetCursorPos(newX, newY);
                        return (IntPtr)1; // Block the original movement
                    }
                }
            }
            return CallNextHookEx(_mouseHookID, nCode, wParam, lParam);
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
        
        [DllImport("user32.dll")]
        static extern bool SetCursorPos(int X, int Y);
    }
}
