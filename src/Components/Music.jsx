import React, { useRef, useEffect, useState } from "react";
import { Howl } from "howler";

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false);
  const sound = useRef(null);

  useEffect(() => {
    const setupSound = () => {
      const audio = new Howl({
        src: ["/music/relaxation-meditation.mp3"],
        autoplay: true,
        preload: "auto",
        mute: isMuted,
        onend: () => {
          // You can add any logic you want to handle when the music ends
        },
      });

      return audio;
    };

    sound.current = setupSound();

    return () => {
      if (sound.current) {
        sound.current.unload();
      }
    };
  }, [isMuted]);

  return null; // You don't need to render anything for this component
};

export default BackgroundMusic;
