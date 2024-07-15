#!/usr/bin/env python3

from pytube import YouTube
import os

def on_progress(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage_of_completion = bytes_downloaded / total_size * 100
    print(round(percentage_of_completion, 0))

def main(url):
    chunk_size = 1024
    yt = YouTube(url)
    video = yt.streams.filter(only_audio=True).first()
    yt.register_on_progress_callback(on_progress)
    print(f"Fetching audio from \"{video.title}\"..")
    print(f"Information: \n"
          f"File size: {round(video.filesize * 0.000001, 2)}mb")

    print(f"Downloading \"{video.title}\"..")
    out_file = video.download(output_path=".")

    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'
    os.rename(out_file, new_file)

yt_link = input("Link pls: ")
main(yt_link)


