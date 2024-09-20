---
title: Optimizing My Resume
draft: true
tags:
---
Found an open source tool called 'Resume Matcher'

Followed install instructions, 
ran into issues while installing the Python Virtual Environment, 
managed to resolve the issue by using AI to give me the steps to follow to resolve it.
Ran the pip install -r requirements.txt, kept failing because of cytoolz.
uninstalled cytools
reinstalled version specified in requirements.txt 0.12.1
still didn't work
tried using the latest up to date version 0.12.3
still same error
uninstalled it again
changed the specified version in requirements.txt to the newer version 0.12.3
installed the 0.12.3
re-run the pip install -r requirements.txt command
ran through without the error
failed at another step (jellyfish)
Cargo, the Rust package manager, is not installed or is not on PATH.
installed Rust
restarted Shell (restarted VSCode)
re-run pip command
passed through the previous error
got a new error (numpy)
something something 'distutils' not found, no longer included with x-y-z version
try fix suggested by ai, doesn't-work
try installing numpy by itself 1.25.1
change numpy version in requirements from 1.25.1 to current 2.1.1
re-run pip command
passes through the error as the requirement is now satisfied
fails again at PyYAML version 6.0 requirement
Runs the error through AI
Tries suggested fixes, assume its going to be the same as before 
re-run the pip command
same error
install latest PyYAML which is 6.0.2 and changes the requirements to it in the .txt
re-run pip command
error for SciPy version 1.10.1
install latest SciPy 1.14.1, change it in the requirements
rerun pip
error with spacy and spacy-loggers version, changed spacy to 3.7.6 instead of 3.6.0 and spacy-loggers to 1.0.5 instead of 1.0.4
rerun pip
error srsly 2.4.6, changed in requirements to 2.4.8
rerun pip
error thinc 8.1.10 update to 8.2.5, change in requirements to 8.2.5
rerun pip
conflicting dependencies in your `requirements.txt` file, specifically related to the version of `numpy` that is being requested.
try to Adjust Numpy Version: Since `scipy 1.14.1` requires `numpy` to be `>=1.23.5` and `<2.3`, changed the `numpy` version in `requirements.txt` to a compatible version: `numpy>=1.23.5,<2.3`
rerun pip

There's 116 required packages (or libraries idk the difference) for this single project, I may be a newbie but this seems like A LOT... too much to be precise...



Tools used:
- DuckDuckGO Chats AI for anonymization while keeping the latest models like GPT-4o
- VSCode
- GitHub for forking Resume Matcher
- 