# Few-Shot Blueprint: Mapping Pydantic SightingFrame to Firestore Document
from datetime import datetime, UTC
from models.sighting_frame import SightingFrame

def map_frame_to_firestore(frame: SightingFrame) -> dict:
    # Golden Pattern: Always map lat/lng to latitude/longitude when storing raw data
    return {
        "course_id": frame.course_id,
        "session_id": frame.session_id,
        "timestamp": frame.timestamp,
        "received_at": datetime.now(UTC).timestamp(),
        "is_calibration": frame.is_calibration,
        "rig_size_meters": frame.rig_size_meters,
        "sightings": [
            {
                "color": sighting.color,
                "confidence": sighting.confidence,
                # Resolve coordinate naming mismatch
                "latitude": sighting.location.get("latitude") if sighting.location else None,
                "longitude": sighting.location.get("longitude") if sighting.location else None,
                "weight": sighting.weight,
            }
            for sighting in frame.sightings
        ]
    }
