import React from 'react';

const keyboardAudio = [
  new Audio('/sounds/keystroke1.mp3'),
  new Audio('/sounds/keystroke2.mp3'),
  new Audio('/sounds/keystroke3.mp3'),
  new Audio('/sounds/keystroke4.mp3'),
];

const useKeyboardSound = () => {
  const playKeyboardSound = () => {
    const randomAudio =
      keyboardAudio[Math.floor(Math.random() * keyboardAudio.length)];

    randomAudio.currentTime = 0;
    randomAudio
      .play()
      .catch((err) => console.log('Error playing keyboard sound', err));
  };
  return { playKeyboardSound };
};

export default useKeyboardSound;
