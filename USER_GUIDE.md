# User Guide

## Overview

Study Workspace là web app cá nhân để quản lý việc học theo course và lecture. App hỗ trợ:

- Đăng ký, đăng nhập, đăng xuất
- Quản lý courses
- Quản lý lectures trong từng course
- Ghi chú lecture theo cấu trúc
- Lưu timestamps để review video local
- Upload tài liệu lecture
- Quản lý assignments và action items
- Review course
- Search trong course

App được thiết kế cho một người dùng đã xác thực. Mỗi người chỉ thấy dữ liệu của riêng mình.

## Important notes

- App không có tính năng AI
- App không upload hoặc host video trên server
- `timestamps` chỉ dùng để ghi mốc thời gian thủ công khi xem video local
- Lecture materials là file tài liệu như PDF, slide, note, worksheet

## Start the app

### Run locally

```bash
npm install
npm run dev
```

Mở:

```text
http://localhost:3000
```

### Production checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Authentication

### Sign up

1. Mở `/signup`
2. Nhập:
   - display name
   - email
   - password
3. Submit form

Kết quả:

- Nếu Supabase đang tắt email confirmation: app có thể tạo session ngay
- Nếu Supabase đang bật email confirmation: app sẽ báo bạn kiểm tra email để xác nhận tài khoản

### Log in

1. Mở `/login`
2. Nhập email và password
3. Submit form

Sau khi đăng nhập thành công, app chuyển tới:

```text
/dashboard
```

### Log out

- Bấm nút `Log out` trong sidebar

## App navigation

Sidebar chính:

- Dashboard
- Courses
- Lectures
- Materials
- Tasks
- Review
- Search

## Typical workflow

Luồng dùng app khuyến nghị:

1. Tạo course
2. Tạo lecture trong course
3. Điền overview lecture
4. Ghi objectives, concepts, examples, timestamps, questions
5. Upload lecture materials nếu có
6. Tạo tasks cho lecture
7. Dùng review để xem lecture nào yếu hoặc còn việc dang dở
8. Dùng search để tìm nhanh kiến thức trong course

## Dashboard

Route:

```text
/dashboard
```

Dashboard hiển thị:

- Recent courses
- Recent lectures
- Upcoming tasks
- Các entry points chính vào app

Dashboard hữu ích để quay lại đúng phần đang học dở.

## Courses

Route:

```text
/courses
```

### Create course

Ở trang Courses:

1. Điền form tạo course
2. Các field chính:
   - name
   - code
   - semester
   - color
   - description
3. Bấm tạo

### Course list

Mỗi course card cho phép:

- Mở course workspace
- Chỉnh sửa
- Xóa

### Delete course

- Có delete confirmation
- Khi xóa course, toàn bộ lectures, tasks, materials, và dữ liệu liên quan trong course sẽ bị xóa theo cascade rules

## Course detail

Route:

```text
/courses/[courseId]
```

Trang course detail là nơi:

- Tạo lecture mới
- Xem danh sách lectures
- Chỉnh sửa course
- Xem upcoming tasks trong course
- Xóa course

## Lectures

### Lectures overview

Route:

```text
/lectures
```

Trang này hiển thị lecture trên toàn workspace để bạn mở nhanh lecture bất kỳ.

### Create lecture

Lecture được tạo trong course detail page.

Các field hỗ trợ:

- title
- topic
- lecture number
- lecture date
- lecturer
- duration minutes
- local video label
- record link
- slides link
- summary
- understanding score

### Lecture detail workspace

Route:

```text
/courses/[courseId]/lectures/[lectureId]
```

Lecture detail là trung tâm làm việc chính của app.

Các tab chính:

- Overview
- Notes structure
- Review cues
- Tasks
- Materials

## Lecture overview

Tab `Overview` cho phép:

- Chỉnh sửa toàn bộ lecture metadata
- Chỉnh summary
- Chỉnh understanding score
- Xóa lecture

Delete lecture có confirmation.

## Structured lecture sections

### Objectives

Dùng để lưu mục tiêu chính của lecture.

Field:

- content

### Concepts

Dùng để ghi khái niệm quan trọng.

Fields:

- title
- definition
- formula
- example
- usage note

### Examples

Dùng để lưu ví dụ hoặc worked example.

Fields:

- title
- description

### Timestamps

Dùng để lưu mốc review video local.

Fields:

- time label
- seconds
- title
- note

Lưu ý:

- Đây không phải video playback feature
- App không stream video
- Bạn tự mở video local trên máy và dùng timestamp để quay lại đúng đoạn

### Questions

Dùng để ghi câu hỏi còn chưa rõ hoặc đã giải quyết.

Fields:

- content
- status

Status:

- unresolved
- resolved

## Tasks

### Lecture tasks

Trong tab `Tasks` của lecture, bạn có thể tạo và quản lý task gắn với lecture đó.

2 loại task:

- assignment
- action

Fields:

- type
- title
- description
- due date
- status

Status:

- todo
- doing
- done

### Task actions

Bạn có thể:

- Tạo task
- Edit task
- Đổi status nhanh
- Xóa task

UI sẽ:

- Group theo assignment và action item
- Hiển thị overdue task
- Hiển thị badge trạng thái

### Tasks overview page

Route:

```text
/tasks
```

Trang này gom tasks trên toàn workspace và group theo type.

## Materials

### Lecture materials

Trong tab `Materials` của lecture, bạn có thể:

- Upload một hoặc nhiều file
- Xem danh sách file
- Open file
- Download file
- Delete file

Thông tin hiển thị:

- file name
- file type
- file size
- upload time

### Allowed usage

Materials dành cho:

- PDF
- slides
- notes
- worksheet
- tài liệu học tập tương tự

Không dùng cho:

- video upload

### Duplicate file names

Nếu upload file trùng tên trong cùng lecture folder:

- app sẽ tự rename bằng suffix số

### Materials overview page

Route:

```text
/materials
```

Trang này hiển thị materials trên toàn workspace và cho phép nhảy về lecture chứa file đó.

## Review

Route:

```text
/review
```

### Purpose

Review page giúp bạn ôn tập theo course.

### How to use

1. Chọn course
2. Xem danh sách lectures trong course
3. Mỗi lecture hiển thị:
   - title
   - lecture number nếu có
   - lecture date nếu có
   - summary
   - understanding score
   - unresolved question count
   - unfinished task count
4. Mở lecture trực tiếp nếu cần sửa hoặc ôn lại

### Filters

Review hỗ trợ filter:

- low understanding
- has unfinished tasks
- has unresolved questions

Phù hợp để xác định lecture nào cần ôn lại trước.

## Search

Route:

```text
/search
```

### How search works

Search hiện là course-scoped.

Bạn cần:

1. Chọn course
2. Nhập từ khóa
3. Submit search

Search quét qua:

- lecture title
- topic
- summary
- concepts
- questions

### Search results

Mỗi kết quả:

- gắn với một lecture cụ thể
- có label ngữ cảnh như `Lecture title`, `Topic`, `Summary`, `Concept`, `Question`
- có snippet để bạn biết match xuất hiện ở đâu
- có link mở lecture tương ứng

## Protected routes

Các route trong app chính yêu cầu đăng nhập.

Nếu chưa đăng nhập:

- app sẽ redirect về `/login`

Auth routes công khai:

- `/login`
- `/signup`

Protected routes:

- `/dashboard`
- `/courses`
- `/lectures`
- `/materials`
- `/tasks`
- `/review`
- `/search`

## Error handling

App có:

- global loading state
- route loading states cho các section chính
- global error boundary
- protected-app error boundary
- not-found page
- form validation errors
- mutation feedback cho create/update/upload actions

## Delete confirmations

Delete confirmation hiện có ở các flow quan trọng:

- delete course
- delete lecture
- delete material
- delete task
- delete lecture section items

## Data ownership and privacy

App dùng Supabase RLS để đảm bảo:

- user chỉ thấy dữ liệu của riêng mình
- materials path gắn với `user_id`
- private storage bucket chỉ cho phép truy cập đúng ownership path

## Supabase setup notes

### Required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Required setup

1. Apply SQL migrations trong `supabase/migrations`
2. Tạo bucket `lecture-materials` nếu chưa có
3. Giữ bucket ở chế độ private
4. Cấu hình auth redirect URL:

```text
http://localhost:3000/auth/callback
```

## Recommended validation checklist

Trước khi bàn giao hoặc deploy, nên test thực tế:

1. Sign up
2. Log in
3. Log out
4. Create/edit/delete course
5. Create/edit/delete lecture
6. CRUD objectives/concepts/examples/timestamps/questions
7. Upload/open/download/delete materials
8. CRUD tasks và quick status updates
9. Review filters
10. Search results

## Known limitations

- Không có AI features
- Không có semantic search
- Không có server-side video upload
- Không có calendar integration
- Không có notification system
- Không có multi-user collaboration
- Timestamps chỉ là mốc review video local thủ công

## Related docs

- `README.md`
- `AGENT_PROGRESS.md`
- `supabase/AUTH_SETUP.md`
- `supabase/STORAGE_SETUP.md`
