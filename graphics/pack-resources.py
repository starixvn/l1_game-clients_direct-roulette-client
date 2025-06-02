#!/usr/bin/python

import os
import shutil
import subprocess

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.realpath(__file__))
    project_dir = os.path.join(current_dir, '')

    images_dir = ".\images"
    main_bet_highlight_dir = ".\images\\bet-option-highlight\\main-bet"
    side_bet_highlight_dir = ".\images\\bet-option-highlight\\side-bet"

    # Pack main images.
    packer_path = os.path.join(
        project_dir,
        'pack.js'
    )

    outputPath = os.path.join(project_dir, '..\\', 'src\\assets\\game\\images')
    subprocess.Popen([
        'node',
        packer_path,
        '-t',
        'remote',
        '-a',
        'http://10.10.50.17:3456',
        '-i',
        os.path.join(project_dir, images_dir, 'texture_packer.json'),
        '-o',
        outputPath
    ]).wait()

    # Pack bet-option-highlight images.
    subprocess.Popen([
        'node',
        packer_path,
        '-t',
        'remote',
        '-a',
        'http://10.10.50.17:3456',
        '-i',
        os.path.join(project_dir, main_bet_highlight_dir, 'texture_packer.json'),
        '-o',
        outputPath
    ]).wait()

    subprocess.Popen([
        'node',
        packer_path,
        '-t',
        'remote',
        '-a',
        'http://10.10.50.17:3456',
        '-i',
        os.path.join(project_dir, side_bet_highlight_dir, 'texture_packer.json'),
        '-o',
        outputPath
    ]).wait()
