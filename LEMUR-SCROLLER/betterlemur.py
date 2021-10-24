#!/usr/bin/env python
# Display a runtext with double-buffering.
from PIL import Image
import random

import os

abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

from rgbmatrix import graphics
from rgbmatrix import RGBMatrix, RGBMatrixOptions
import time

delay = 0.01

#import getlemurdata

options = RGBMatrixOptions()
options.rows = 32
options.cols = 64
options.chain_length = 1
options.parallel = 1
options.gpio_slowdown = 2
options.brightness=20
options.hardware_mapping = 'adafruit-hat'
options.daemon = False
options.drop_privileges = False
matrix = RGBMatrix(options = options)


offscreen_canvas = matrix.CreateFrameCanvas()
font = graphics.Font()
font.LoadFont("fonts/10x20.bdf")

textColor = graphics.Color(255, 255, 255)
pos = offscreen_canvas.width

file = open('/home/pi/ScrollingLemurs/endangered.txt', 'r')
lines = file.readlines()

out = []
for line in lines:

    image = Image.open('lemur-photos/'+random.choice(os.listdir("lemur-photos/")))
    img_width, img_height = image.size

    xpos=-2
    while xpos<=img_width-64:
        xpos += 1
        offscreen_canvas.SetImage(image, -xpos)
        offscreen_canvas.SetImage(image, -xpos + img_width)

        offscreen_canvas = matrix.SwapOnVSync(offscreen_canvas)
        time.sleep(delay)


    lemur = line.split(",")[0] + ": "
    status = line.split(",")[1][:-1]
    names = line.split(",")[2:]

    if status=='Endangered':
        ecolor = graphics.Color(255, 121, 18)
    elif status=='Critically Endangered':
        ecolor = graphics.Color(255, 0, 0)
    elif status=='Vulnerable':
        ecolor = graphics.Color(255, 255, 0)
    elif status == 'Data Deficient':
        ecolor = graphics.Color(255, 18, 247)
    else:
        ecolor = graphics.Color(0, 255, 0)

    donames = False

    if len(names):
        donames = True
        names = names[0].split('/')
        
        namestr = f"The Duke Lemur Center has {len(names)} {lemur}s! Their names are "
        for i in range(len(names)-1):
            namestr+= names[i]
            namestr+= ", "
        if len(names):
            namestr += "and "
            namestr += names[-1]
            namestr += "."
    

    pos = offscreen_canvas.width

    length = 0
    elength = 0

    #print(pos+length)
    while (pos + length +elength > 0):

        offscreen_canvas.Clear()
        length = graphics.DrawText(offscreen_canvas, font, pos, 20, textColor, lemur)
        elength = graphics.DrawText(offscreen_canvas, font, pos+length, 20, ecolor, status)
        pos -= 1

        time.sleep(delay)
        offscreen_canvas = matrix.SwapOnVSync(offscreen_canvas)
    
    if donames:
        length=0
        pos = offscreen_canvas.width

        while (pos + length > 0):

            offscreen_canvas.Clear()
            length = graphics.DrawText(offscreen_canvas, font, pos, 20, textColor, namestr)
            pos -= 1

            time.sleep(delay)
            offscreen_canvas = matrix.SwapOnVSync(offscreen_canvas)

    matrix.Clear()