; Inno Setup Script for Tech-Tonicml Platform Desktop App
; Professional Windows Installer with License Agreement and Progress Bar

#define MyAppName "Tech-Tonicml Platform"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Natnael Ermiyas - Ethco Coders"
#define MyAppURL "https://tech-tonicml.gt.tc"
#define MyAppExeName "TechTonicmlPlatform.exe"
#define MyAppIcon "web\assets\icons\techtonicml.ico"

[Setup]
; Application Information
AppId={{8F9D2E5C-4B7A-4D1E-9C3F-1A2B3C4D5E6F}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Installation Directories
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}

; Output Configuration
OutputDir=installer
OutputBaseFilename=TechTonicmlPlatform-Setup-v{#MyAppVersion}
SetupIconFile={#MyAppIcon}

; Compression
Compression=lzma2/max
SolidCompression=yes

; Installation Type
PrivilegesRequired=lowest
ArchitecturesInstallIn64BitMode=x64compatible

; License Agreement
LicenseFile=LICENSE.txt

; Visual Settings
WizardStyle=modern
WizardImageFile=compiler:WizModernImage-IS.bmp
WizardSmallImageFile=compiler:WizModernSmallImage-IS.bmp

; Uninstall
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Include all files from the dist folder
Source: "dist\TechTonicmlPlatform\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Start Menu
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\_internal\web\assets\icons\techtonicml.ico"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Desktop Icon (optional, based on user selection)
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\_internal\web\assets\icons\techtonicml.ico"; Tasks: desktopicon

; Quick Launch (optional)
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
; Option to launch application after installation
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
var
  ProgressPage: TOutputProgressWizardPage;

procedure InitializeWizard;
begin
  // Create custom progress page
  ProgressPage := CreateOutputProgressPage('Installing', 'Please wait while Setup installs {#MyAppName} on your computer.');
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    ProgressPage.SetText('Extracting files...', '');
    ProgressPage.SetProgress(0, 100);
  end;
end;

procedure CurInstallProgressChanged(CurProgress, MaxProgress: Integer);
begin
  // Update progress bar during installation
  if MaxProgress > 0 then
  begin
    ProgressPage.SetProgress(CurProgress, MaxProgress);
  end;
end;

[Messages]
; Custom messages for better user experience
WelcomeLabel1=Welcome to {#MyAppName} Setup
WelcomeLabel2=This will install {#MyAppName} on your computer.%n%nA desktop application for accessing the Tech-Tonic ML Course Platform.%n%nPowered by Natnael Ermiyas - Ethco Coders
FinishedLabel=Setup has finished installing {#MyAppName} on your computer. The application may be launched by selecting the installed icons.
