---
title: 💡 A Creative Approach To Troubleshooting
draft: false
date: 2024-09-21
tags:
  - Troubleshooting
  - SysInternals
---
### Insights Gained From Solving An Unusual Bug Creatively

I encountered a bug in the software I use to import photos from my camera (Nikon Transfer 2), which prevented me from changing the destination folder in the "Backup Destination" tab.

After searching online for a solution without success, I decided to visit the manufacturer's support page to report the issue, hoping it might be addressed in a future update, as I initially believed it was a problem with the software itself.

Here's what I included in the support ticket:

> **Bug Reproduction Steps:**
> 
> 1. Select the "Backup Destination" tab.
> 2. Check "Backup files."
> 3. Click on "Backup destination folder:" > "Browse" > "Select folder" > _Nothing happens._

I also provided a screen recording of the issue to better illustrate the problem, as you can see here:

![[NT2ScreenRecording.mp4]]

### Initial troubleshooting attempts

After several exchanges with various individuals who either didn’t fully grasp the issue or, to their credit, acknowledged the need to escalate it to someone more capable, I still found myself without a solution.

I attempted the standard troubleshooting steps:

- Uninstalling the software.
- Reinstalling it.
- Trying both with and without deleting user settings during the uninstallation process.

Unfortunately, none of these actions produced any positive results.


I also explored additional options:

- Disabling my antivirus real-time protection as recommended by support, although I struggled to see how it could be related to the problem.
- Utilizing compatibility settings for the executable, such as running it in Windows 8 mode.
- Trying an alternative file manager called '[Files](https://github.com/files-community/Files)' to select the path, but this approach was ineffective, likely because it doesn’t integrate deeply enough into the system to influence the specific folder selection dialog window. This alternative simply adds a registry key to set it as the default file manager when some call is made to use the explorer, which can for instance redirect the 'Win + E' shortcut to open it instead of the standard explorer.


### Suggestion from support that I inadvertently overlooked 

After following the support's suggestion to test the software on another computer and not encountering the issue, I realized that it was probably a problem unique to my machine.

Despite this, I still couldn't identify the root cause of the problem, although I suspect it may be linked to my modifications of Windows .dll files through projects like '[Rectify11](https://github.com/Rectify11/Installer)'.


### Exploring an alternative approach to the issue

At that point, I considered whether there might be a different way to address my issue without relying on the software's interface.

During my conversation with tech support, I came up with the following idea: 

> "*What if the issue is impossible to resolve through the software's designated menu for selecting the backup folder? **Could there be a way to modify a user settings file that indicates the currently selected folders?***"

While this solution may not be ideal, it would enable me to **circumvent the problem**, even if it involves **editing a Windows registry key** that holds this information, or altering the **user settings file** in a hex editor to **specify the path** to the folder where I want to back up my photos during the transfer.

Alternatively, I could set this path on another computer using NT2 (for example, '`D:\BackupNikon`') and then transfer that specific user file to my original computer to establish the path as the default.

I recognize that **these methods are quite unconventional**, but I am determined to find a solution to the problem, even if it means taking non-standard approaches.

Ultimately, I decided to follow this approach to gain insight into what the process was doing.

### Putting the creative solution to the test

The method was based on the idea of checking if the "path" was a value stored in a registry key and modifying it. To clarify, here’s what I did:

1. **Using the ProcMon tool (Process Monitor from the SysInternals suit of tools from Microsoft), I filtered the data related to the NT2 executable ('`NktTransfer2.exe`').**

![[ProcessMonitorFilter.png]]

2. **I searched for a unique path specific to my machine that was designated for the "primary destination." ('`D:\Nikon Transfer 2`')**

![[ProcessMonitorFind.png]]

3. **I found a match in the registry key '`HKCU\Software\Nikon\NkFramework\Nikon Transfer 2\Application\Destination\Primary\Folders\LastPath1`'.**

![[ProcessMonitorMatch.png]]


4. **I opened the registry, navigated to the relevant key, and discovered another key under '`\Backup\Folders\LastPath1`'.**


![[RegistryPrimaryPathBlurred.png]]

![[RegistryBackupPathBlurred.png]]

5. **I modified the default value to the desired path, ensuring that NT2 was closed beforehand.**

![[RegistryEditString.png]]

6. **After saving the registry changes, I relaunched NT2 and was pleased to see that the modification had worked!** ✅

![[NT2BackupPath.png]]

### Note on backup strategy

For the record, I am using a backup folder located on a **Storage Space** created with the Windows Storage Space utility in the control panel. This setup consists of a mirrored 1TB pool made up of two NVMe SSDs, providing both **speed and redundancy** as my primary backup layer:


![[ManagedStorageSpaces.png]]


Additionally, I make copies using [Duplicati](https://github.com/duplicati/duplicati) on a separate storage solution, adhering to the **3-2-1 backup rule**: maintain **three copies of your data** (the original and two backups) on **two different types of storage media**, with **one copy stored offsite**. 

This strategy ensures redundancy and safeguards against data loss due to hardware failure, theft, or disasters.

### Tools I Used

- SysInternals' [Process Monitor](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon) (aka. 'ProcMon') from Microsoft
- Registry Editor
- Windows Storage Spaces
- [Duplicati](https://github.com/duplicati/duplicati)

Other tools used in the making of this blog post:
- DaVinci Resolve for blurring Screen Capture
- Affinity Photo for blurring Screenshots


PS: I know that blurring can now be reverse-engineered to find the original text, but since there's nothing really sensitive, that approach was the option I settled on rather than a black box/redacted square that should be used as the default method to redact actual sensitive information as a good practice.