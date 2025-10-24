import React, { useState, useRef } from "react";
import { X, Play } from "lucide-react";

interface Video {
  id: number;
  title: string;
  filename: string;
}

const VideoFile = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videos = [
    { id: 1, title: "Mixed Flower Arrangement", filename: "Mixedflowervideo.mp4" },
    { id: 2, title: "Office Desk Decoration", filename: "OfficeDesk.mp4" },
    { id: 3, title: "Coloured Rose Box", filename: "Colouredroseboxvideo.mp4" },
    { id: 4, title: "Flower Arrangement", filename: "Flowerarrangementvideo.mp4" },
    { id: 5, title: "Flower Making Process", filename: "FlowerMaking.mp4" },
    { id: 6, title: "Gifts Making", filename: "Giftsmakingvideo.mp4" }
  ];

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="w-full py-8">
      {/* Heading */}
      <div className="px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-left">
          Floral Arrangement Videos
        </h2>
      </div>

      {/* Reels style videos grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative group rounded-2xl overflow-hidden aspect-[9/16] bg-gray-200">
                <video
                  className="w-full h-full object-cover rounded-2xl"
                  preload="metadata"
                  muted
                  playsInline
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.pause();
                    video.currentTime = 0;
                  }}
                >
                  <source src={`src/CategoryImages/${video.filename}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Overlay with play icon */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300 rounded-2xl">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-gray-800 ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 text-center">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
    {/* Modal */}
{isModalOpen && selectedVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
    <div className="relative max-w-sm w-full aspect-[9/16] overflow-hidden rounded-2xl">
      
      {/* Close button inside top-right corner */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-all"
      >
        <X size={20} />
      </button>

      {/* Video */}
      <video
        className="w-full h-full object-cover"
        controls
        autoPlay
        playsInline
      >
        <source src={`src/CategoryImages/${selectedVideo.filename}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Title bar at bottom */}
      <div className="p-2 bg-black/40 text-center absolute bottom-0 w-full">
        <h3 className="text-lg font-semibold text-white">{selectedVideo.title}</h3>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default VideoFile;
