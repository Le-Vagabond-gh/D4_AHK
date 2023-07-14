#NoEnv
#SingleInstance Force
SendMode Input
SetBatchLines -1
SetWorkingDir A_ScriptDir

#IfWinActive Diablo IV

#Persistent

global base64Image = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAB+RJREFUeJyNVslvG/cZfbNwZriTIimRpnZZ1mLJdVw7duUmbR20x+biHAo0RW899f/orSjaAr31mh7SAEULBHFb+FBXqdPI1WbLsiRq4b7NkJyFw9n6DZ2kSSMb/gEDEMOZ3/t973vfe8PjnLU6P+11Ol1A4jEyPgNeEOB5DAJSCPGRDOA+f87zPFi2Bcd2YJkGVLmBAb03ULsolMrMeXvz/39jceGiFxyfwFhmFKl0BpFYDIzr0sYD8DwDlmGhd9pDMM/1wLAROGwQDv22vGl0mg1I4TjGSsde++QQ+8+OmHMB5ybz3vjVG1i4eg2BAA9rYMDSe9BqBTCei4CnQrdtuK5fjQ6WE0HwBMjCtOmXQMB0L51OwKP93MlZxOjiUzue1GtjY/cJ8wXgd+/e9eKpUVyYnEC/20PtqADX6kNvFelNG7EoUSqyVG0IoiQRKEc0umCo2m5Hg6FoUNUyAgKDpicgmEjDDaUhUAvGl1dgyjLWpuY9+bSg8N9/9ycenRODvoFmqYTasz3IlTOqgEFqJIg31uaRzYTp5BLCkQBEMfBZAx0C9ohKF5ruYnOrhO3dCko1HZXDQ3ChFqK5Sb/RkEQR8dFRtKulBB8QouhW66js7SEY9kVgYmo8QkALuP36RUzNRIa943mW3rV8pHOkkMCN65fR7el4uFHCe+89wP5TBVp9B7F0GtH5SZgkpM5pAXyzeIaplSvUAx6tgy3MEcBPf/wm1q5fGm7FCSY0jRSo2ghKHGzHGd7/XAmaZiOZAnTDQIwo/8Fbt/Ctm1fxy1+9j3sf7SGWSNE1gv3tTbAOCY/jOfRVEke9hVRCwN23b+La6gxRRWCcBK3Twl8/3MfoqEBVilA65hDIdRkaEcDQeCyuDBCJJ8CSWn3lRsJhvPujO3j06AR9g/rb6yLAB5DMjIEXORZqs4J+X8bNb45iIp8enp9hQ7RZG41SBW98TwI9hnDIoE2fU+oxAmwCPTsBQiFgoFHfYZFwYkMxZUcTWFzMYWdfRrVchE5F9VQdvEtNT8bTMMc0cLyvPOazChzoShnprAOGAwH5tHEw+gQcJKH0GWxsMFheBkyt5p8AbtCC1m0gFM0ORSUEnk9dmDjXyBAimTT4vqGSGDIIhiIw+wpV6hIYi163BpN4lXwNO/ZQkaJgQVU4nNQ8GMTslSUBoYhDIB46ch1JhwwAEh2sRPRz6HYNCKTQgaHTGFkIiiRAVenAyFFlQgifbu/hO98mkRDvPaUKXZMRJqG4BPxgvYN8jsP0HIcRqjgZj6GtGEOwvslCU/1xkeHwUQTEIAYDG8fHTYjZCQx0DVbfRGFrm+GdbhsOKY/lSIFiAm3ZrzhFja4P6ShVLJimi0bDov+A3SfPjdR0yjRfDK6sxOAMBsN7va4GIe4iTFTuPS1Bpz5LrD/lzBe65nnHpBOoCJHkIskMPt06wJ03JxAgmzLplAGxB4uxsbzooFzsY3Kc3EX1UKmbkAQOnu3RyDDD3nukB13uIZcZwScbxwhGo7DpMC5ZokX+OwTcPTpjLkVT3vQ3yEODPB7tVHF6fECnF9AnKjVNhW31hucTeQMzExIx4oOYw9EB/WeZCaLVQTQagdzsoBFu4ZPNCsR0FqY1gNJqo1Zr/M9Lu6VDyPkcktkLkNIX8MGft/HO26tQZFIuayIUpHkjVZaqFsp1FtEgh6ZiIUTxVaxZRBP1kVTU7dHzUhS/+PXf4EgRcEEJNhlCixzmK2mRIIUqlQqZcwJiIontvTMszdVw48YEikUNbKCPAZm5wFlwyZxbCp2arvHLLEYSZNiyTY5EYopH8OxYxkGphvTsIux+n2yzilQkSDOofQmQ5qSpyDAoKYLRMMTp1/G4cICrr+WxsJwm0CZF0IAAaRa4MBjyVkOzIFELTD98HQsey+G0pOD+gx4yuSmqNAy9q6DXofSpNpmvVPjx5g5zfWXJ6zYaNOAckvkxPNzlsPSfMu68Faf548jawoiTirstEwJR6vsDBQFsEo1PreWwOC2a6Kgu8ksTKNNeWldFhBirFU+/HsD/3nnCXL500QvNLqBVKyI7NYsPHzxGbtLFygKZZg7o61ECiRG9XYjBLRqDMMbJCjOZFP7xcRGbT23k5lcg18pg+SBYUufhk+3zE99fu/sHjCeFvdz8Ej2sE9cX8dvfbeLnP+OxPE9jE52hjURynTHcXnNROWsjf+EC/nLvGH9fryEwtkyfOy5sMl5daYM7J8q+9k3zeGuT4aWQlyHFxpJk2vO38IcPNvHODz3cuDZLojFgqE3MzyUpyhL457/OcH/9DKZ0mfI0RNbXhCx3wDVKOPhS714I6K+th+vMazdven2Vkn58CmZoAb/5/R5ub/4Ra7fWyG9VyjULh0cy3v9TAaH8KtIjKRTpo8miLwe2VcLhOWAvBPSX0ah3XTYfGxwfUqVJCJk53H/cwc7RBpJRShBGwu4Zh9jEKpmyiHrxgALChl49xVH5fLCXAu4dFeKXKE2t0SzcjkJRE0CKaFbVOIrlDnL5LHLTDBT6qquTH/te3Cke4uCk9UKwlwL6a79wwlymmFVCSUai/sj07SOSe6Qm58gjTRSPnlLWhaG2FTzdevJSoFcC9NduoUTRW0J2ctoLkL9GRnMQKMo67QZarQ6a9SrNWeWVwF4J8PNVPT0ebhqNJ7xMJoteq46ZSxexfu+jVwbz138BbYzYcRKHC+EAAAAASUVORK5CYII=" 
Menu Tray, Icon, % "HBITMAP:*" hICON := CreateBitMap(base64Image)
Menu Tray, Icon

global imgX1 = 912 ; x coordinate for the first combo point
global imgY = 512 ; y coordinate for all combo points
global imgSpacing = 28 + 7 ; spacing between images

CreateGUI(1, imgX1, imgY)
CreateGUI(2, imgX1 + imgSpacing, imgY)
CreateGUI(3, imgX1 + 2*imgSpacing, imgY)

global colorTolerance = 50 ; color tolerance, increase or decrease this value to be more or less strict

SetTimer, CheckPixel, 50 ; checks pixel every 100 milliseconds
CheckPixel:
CoordMode, Pixel, Screen ; interprets the coordinates as absolute screen coordinates

; Check first pixel
PixelGetColor, color1, 924, 920
if (ColorIsClose(color1, "0x85DEE4", colorTolerance))
{
    WinShow, ahk_id %Gui1%
}
else
{
    WinHide, ahk_id %Gui1%
}

; Check second pixel
PixelGetColor, color2, 958, 920
if (ColorIsClose(color2, "0x85DEE4", colorTolerance))
{
    WinShow, ahk_id %Gui2%
}
else
{
    WinHide, ahk_id %Gui2%
}

; Check third pixel
PixelGetColor, color3, 992, 920
if (ColorIsClose(color3, "0x85DEE4", colorTolerance))
{
    WinShow, ahk_id %Gui3%
}
else
{
    WinHide, ahk_id %Gui3%
}

return


ColorIsClose(color1, color2, tolerance)
{
    r1 := "0x" . SubStr(color1, 7, 2), g1 := "0x" . SubStr(color1, 5, 2), b1 := "0x" . SubStr(color1, 3, 2)
    r2 := "0x" . SubStr(color2, 7, 2), g2 := "0x" . SubStr(color2, 5, 2), b2 := "0x" . SubStr(color2, 3, 2)

    return (Abs(r1 - r2) <= tolerance) && (Abs(g1 - g2) <= tolerance) && (Abs(b1 - b2) <= tolerance)
}

CreateGUI(number, locX, locY) {
    guiNumber := "Gui" . number
    Gui, %number%: +LastFound +AlwaysOnTop -Caption +ToolWindow +Hwnd%guiNumber%
    Gui, %number%: +LastFound +E0x20
    WinSet, TransColor, 0x00FF00
    Gui, %number%:Color, 0x00FF00
    hBitmap := CreateBitMap(base64Image) ; create a bitmap from the Base64 image string
    Gui, %number%:Add, Picture, x0 y0 w28 h28, HBITMAP:%hBitmap% ; use the bitmap in the GUI
    Gui, %number%:Show, NoActivate
    WinMove,,, %locX%, %locY%
}

CreateBitMap(strB64) {
	VarSetCapacity(B64, StrLen(strB64) << !!A_IsUnicode)
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
