// React + Tailwind frontend for Volunteer Matching App
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = "https://clldpnsiyeuvkupnxyey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbGRwbnNpeWV1dmt1cG54eWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODc4ODAsImV4cCI6MjA2NjQ2Mzg4MH0.sjgqwHHxbD-LB0vPjm9CZypLVHmucC-PdKvClymdbSY";
const supabase = createClient(supabaseUrl, supabaseKey);

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const [rawEvents, setRawEvents] = useState(null);

useEffect(() => {
  const fetchEvents = async () => {
    console.log("fetching events from supabase");
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      console.log("fetching events from supabase", data);
      setRawEvents(data);
    }
  };
  fetchEvents();
}, []);

  fetchEvents();
 [];

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function VolunteerDashboard() {
  const [location, setLocation] = useState(null);
  const [userSkills, setUserSkills] = useState(["gardening", "first aid", "math tutoring", "leadership", "Software Skills", "Teaching", "Graphic Design"]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
  if (!location) return;

  const scored = rawEvents.map((event) => {
    const dist = haversineDistance(location.lat, location.lng, event.lat, event.lng);
    const skillMatch = event.skills.filter((s) => userSkills.includes(s)).length;
    const score = -dist + skillMatch * 2;
    return { ...event, score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  setEvents(sorted);
}, [location, userSkills, rawEvents]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Matching Volunteer Opportunities</h1>
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p className="text-sm text-gray-600">Required skills: {event.skills.join(", ")}</p>
            <Button>RSVP</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
