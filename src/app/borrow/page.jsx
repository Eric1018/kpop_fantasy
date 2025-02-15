'use client';

import { closestCorners, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const roles = [
  'Main Vocal', 'Main Dancer', 'Main Rapper', 'Lead Vocal', 'Lead Dancer',
  'Lead Rapper', 'Lead Dancer', 'Sub Vocal', 'Sub Rapper', 'Visual'
];

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomEvents = () => {
  const eventList = [
    'Became the first K-pop girl group to headline the Grammys',
    'Achieved 100 million album sales worldwide, setting a new record',
    'A single became the most-streamed song of all time on Spotify',
    'Won a historic Daesang sweep at the year-end music awards',
    'Caught in a major tax evasion scandal, leading to government investigation'
  ];
  const datingEvent = 'Main vocalist exposed for dating non-celebrity boyfriend Derrick Hsu';
  const shuffledEvents = eventList.sort(() => 0.5 - Math.random()).slice(0, 8);
  return [datingEvent, ...shuffledEvents];
};

const DraggableCard = ({ src, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: src,
    transition: { duration: 250, easing: 'ease-out' },
  });

  return (
    <div className="flex flex-col items-center touch-none">
      <div className="bg-white px-2 py-0.5 text-sm font-bold rounded-full mb-1 shadow-sm">{roles[index]}</div>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ transform: CSS.Translate.toString(transform), transition }}
        className="relative p-3 rounded-2xl w-[220px] h-[280px] bg-gradient-to-br from-[#FFE4F3] to-[#7027e6] shadow-lg"
      >
        <Image src={src} alt={`Member ${index + 1}`} width={220} height={280} className="rounded-xl object-cover w-full h-full" />
      </div>
    </div>
  );
};

const TeamDisplay = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const user_name = typeof window !== "undefined" ? localStorage.getItem("user_name") : null;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [images, setImages] = useState([]);
  const [randomEvents, setRandomEvents] = useState([]);

  const [firstPlaceWins, setFirstPlaceWins] = useState(0);
  const [hitSongs, setHitSongs] = useState(0);
  const [pakCount, setPakCount] = useState(0);
  const [albumSales, setAlbumSales] = useState(0);
  const [worldTours, setWorldTours] = useState(0);
  const [area, setArea] = useState(0);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  useEffect(() => {
    const fetchImages = async () => {
      if (!user_name) return;
      try {
        const res = await fetch(`${API_URL}/api/userCards/${user_name}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setImages(data.map((item) => item.photo).filter((photo) => photo));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [user_name]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    setArea(getRandomNumber(10, 20));
    setFirstPlaceWins(getRandomNumber(70, 130));
    setHitSongs(getRandomNumber(0, 5));
    setPakCount(getRandomNumber(4, 10));
    setAlbumSales(getRandomNumber(10, 50));
    setWorldTours(getRandomNumber(10, 20));
    setRandomEvents(generateRandomEvents());
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = images.indexOf(String(active.id));
        const newIndex = images.indexOf(String(over.id));
        setImages(arrayMove(images, oldIndex, newIndex));
      }}
    >
      <div className={`flex flex-col items-center space-y-6 ${isFullscreen ? 'fixed inset-0 bg-gradient-to-br from-[#e0c3fc] to-[#8ec5fc] h-screen overflow-y-auto pb-[0px]' : 'max-h-[calc(100vh-150px)] overflow-y-auto'}`}>
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-190px)]">
            <button
              onClick={() => router.push("/howtoplay")}
              className="bg-[#38bdf8] text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-[#0ea5e9] transition hover:shadow-[0_0_10px_#38bdf8] text-xl"
            >
              How to Play
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <SortableContext items={images} strategy={rectSortingStrategy}>
                <div className="flex flex-wrap justify-center gap-4 p-4">
                  {images.map((src, index) => (
                    <DraggableCard key={src} src={src} index={index} />
                  ))}
                </div>
              </SortableContext>
            </div>
            {!isFullscreen && (
              <div className="flex space-x-4">
                <button onClick={handleConfirm} className="bg-[#a855f7] text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-[#9333ea] transition hover:shadow-[0_0_10px_#a855f7]">
                  Confirm
                </button>
                <button onClick={() => setIsFullscreen(true)} className="bg-[#38bdf8] text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-[#0ea5e9] transition hover:shadow-[0_0_10px_#38bdf8]">
                  Fullscreen
                </button>
              </div>
            )}
            <div className={`${isFullscreen ? 'w-[80%]' : 'w-[100%]'} p-6 rounded-xl shadow-none transition text-gray-900`}>
              <div className="grid grid-cols-2 gap-6 text-lg font-semibold">
                <div className="bg-[#e9d5ff] p-6 rounded-lg shadow-md max-h-72 overflow-y-auto hover:shadow-[0_0_10px_#d8b4fe] transition">
                  <h2 className="text-2xl font-bold mb-3 text-center text-[#7c3aed]">🌟 Group Achievements</h2>
                  <p>📅 {area} Years Active</p>
                  <p>🏆 {firstPlaceWins} First Place wins</p>
                  <p>🎵 {hitSongs} Song(s) of the Year</p>
                  <p>💿 {pakCount} Perfect All Kills</p>
                  <p>📀 {albumSales}M Albums Sold</p>
                  <p>🌍 {worldTours} World Tours</p>
                </div>

                <div className="bg-[#fde2e4] p-6 rounded-lg shadow-md max-h-72 overflow-y-auto hover:shadow-[0_0_10px_#fb7185] transition">
                  <h2 className="text-2xl font-bold mb-3 text-center text-[#7c3aed]">💫 Notable Events</h2>
                  <ul className="list-disc pl-5">
                    {randomEvents.map((event, idx) => (
                      <li key={idx} className="mb-1">{event}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {isFullscreen && (
              <div className="mt-[250px] flex justify-center">
                <button onClick={() => setIsFullscreen(false)} className="bg-[#a855f7] text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-[#9333ea] transition">
                  Return
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DndContext>
  );
};

export default TeamDisplay;
