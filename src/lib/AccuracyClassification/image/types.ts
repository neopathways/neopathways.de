import { z } from "zod";

export const ZodMediaObject = z.object({
	bitrate: z.string().optional().describe("The bitrate of the media object."),
	contentSize: z.string().optional().describe("File size in (mega/kilo) bytes."),
	duration: z.string().optional().describe("The duration of the item (movie, audio recording, event, etc.) in ISO 8601 date format."),
	encodingFormat: z.string().optional().describe("Media type typically expressed using a MIME format (see IANA site and MDN reference) e.g. application/atom+xml."),
})

export const ZodImageObject = z.object({
	caption: z.union([z.string(), ZodMediaObject]).optional().describe("The caption for this object. For downloadable machine formats (closed caption, subtitles etc.) use MediaObject and indicate the encodingFormat."),
	exifData: z.string().optional().describe("exif data for this object."),
})