# Storage Setup

Bucket name: `lecture-materials`

Path convention:
- `user_id/course_id/lecture_id/file_name`

Notes:
- The foundation migration creates the `lecture-materials` bucket if it does not already exist.
- Storage object policies only allow authenticated users to access files where the first path segment matches `auth.uid()`.
- Keep lecture material metadata in `public.lecture_materials` and the binary object in Supabase Storage.
- Use signed URLs or direct authenticated downloads for file access. The bucket is private.
- Keep local video review outside Supabase Storage. Only lecture materials belong in this bucket.
- If the migration has not been applied in Supabase yet, create the `lecture-materials` bucket manually and keep it private.
- Duplicate filenames inside the same `user_id/course_id/lecture_id/` folder are renamed with a numeric suffix before metadata is inserted.
- Delete flow removes the storage object first, then deletes the `lecture_materials` metadata row.
