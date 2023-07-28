#NoEnv
#SingleInstance Force
SendMode Input
SetBatchLines -1
SetWorkingDir A_ScriptDir

#IfWinActive ahk_exe Diablo IV.exe

Base64PNG_icon := "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"
Menu Tray, Icon, % "HBITMAP:*" hICON := CreateBitMap(Base64PNG_icon)
Menu Tray, Icon

CreateBitMap(ByRef strB64) {
	VarSetCapacity(B64, StrLen(strB64) << !!A_IsUnicode) ; Not need on short string
	B64 := strB64, strB64 := "" ; free memory
	If !DllCall("Crypt32.dll\CryptStringToBinary", "Ptr", &B64, "UInt", 0, "UInt", 0x01, "Ptr", 0, "UIntP", DecLen, "Ptr", 0, "Ptr", 0)
		Return False
	VarSetCapacity(Dec, DecLen, 0)
	If !DllCall("Crypt32.dll\CryptStringToBinary", "Ptr", &B64, "UInt", 0, "UInt", 0x01, "Ptr", &Dec, "UIntP", DecLen, "Ptr", 0, "Ptr", 0)
		Return False
	hData := DllCall("Kernel32.dll\GlobalAlloc", "UInt", 2, "UPtr", DecLen, "UPtr")
	pData := DllCall("Kernel32.dll\GlobalLock", "Ptr", hData, "UPtr")
	DllCall("Kernel32.dll\RtlMoveMemory", "Ptr", pData, "Ptr", &Dec, "UPtr", DecLen)
	DllCall("Kernel32.dll\GlobalUnlock", "Ptr", hData)
	DllCall("Ole32.dll\CreateStreamOnHGlobal", "Ptr", hData, "Int", True, "PtrP", pStream)
	hGdip := DllCall("Kernel32.dll\LoadLibrary", "Str", "Gdiplus.dll", "UPtr")
	VarSetCapacity(SI, 16, 0), NumPut(1, SI, 0, "UChar")
	DllCall("Gdiplus.dll\GdiplusStartup", "PtrP", pToken, "Ptr", &SI, "Ptr", 0)
	DllCall("Gdiplus.dll\GdipCreateBitmapFromStream",  "Ptr", pStream, "PtrP", pBitmap)
	DllCall("Gdiplus.dll\GdipCreateHBITMAPFromBitmap", "Ptr", pBitmap, "PtrP", hBitmap, "UInt", 0)
	DllCall("Gdiplus.dll\GdipDisposeImage", "Ptr", pBitmap)
	DllCall("Gdiplus.dll\GdiplusShutdown", "Ptr", pToken)
	DllCall("Kernel32.dll\FreeLibrary", "Ptr", hGdip)
	DllCall(NumGet(NumGet(pStream + 0, 0, "UPtr") + (A_PtrSize * 2), 0, "UPtr"), "Ptr", pStream)
	Return hBitmap
}

;F2::Reload
;F4::ExitApp
F3::
~SC003::
Suspend

SetTimer, Loop1, Off
SetTimer, Loope, Off
SetTimer, Loopr, Off
SetTimer, Loopq, Off
SetTimer, Loopw, Off
Toggle := ""

MouseGetPos, xpos, ypos  ; Get the current mouse position.
xpos += 25  ; Move the tooltip 25 pixels to the right.
ypos -= 25  ; Move the tooltip 25 pixels up.
ToolTip,% a_isSuspended? "-":"+", %xpos%, %ypos%
SetTimer, RemoveToolTip, -2000
return

RemoveToolTip:
Tooltip
return


RButton::
If (Toggle = "")
{
    SetTimer, Loop1, 40
    SetTimer, Loope, 10
    SetTimer, Loopr, 20
    SetTimer, Loopq, 20
    SetTimer, Loopw, 20
    Toggle := 1
}
Else
{
    SetTimer, Loop1, Off
    SetTimer, Loope, Off
    SetTimer, Loopr, Off
    SetTimer, Loopq, Off
    SetTimer, Loopw, Off
    Toggle := ""
}
return

#IfWinActive ahk_exe Diablo IV.exe
Loop1:
Send, g ; Sends 1
return
Loope:
Send, a ; Sends e
return
Loopr:
Send, z ; Sends r
return
Loopq:
Send, e ; Sends q
return
Loopw:
Send, r ; Sends w
return