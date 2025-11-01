import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { VideoType } from '../types';
import { VideoTarget } from '../types/video';

interface VideoFileProps {
  videoData: VideoType[];
}

const VideoFile: React.FC<VideoFileProps> = ({ videoData }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleVideoClick = (video: VideoType) => {
    setSelectedVideo(video);
    setIsOpen(true);
  };

  return (
    <div className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Our Work</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videoData.map((video) => (
            <div
              key={video.id}
              className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <video
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onMouseEnter={(e) => {
                  const target = e.target as VideoTarget;
                  target.play();
                }}
                onMouseLeave={(e) => {
                  const target = e.target as VideoTarget;
                  target.pause();
                  target.currentTime = 0;
                }}
                muted
              >
                <source src={`src/CategoryImages/${video.filename}`} type="video/mp4" />
              </video>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black p-0 max-w-4xl">
          {selectedVideo && (
            <>
              <video className="w-full" controls autoPlay>
                <source src={`src/CategoryImages/${selectedVideo.filename}`} type="video/mp4" />
              </video>
              <h3 className="text-lg font-semibold text-white">{selectedVideo.title}</h3>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoFile;