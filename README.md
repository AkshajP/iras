# IRAS (Institution Resource Allocation System)

## Objective

To maximise efficiency of booking of a room or common area in the college to reduce conflicts and increase transparency without too much dependency on the admin.

## Current fixes aimed:

- [ ] Fix hydration error caused by `typeof == window` by managing role based access using supabase auth tokens instead of writing to local storage
- [ ] Move all calls to server side rendering
- [ ] Move keys to .env.local and setup repo accordingly
- [ ] Remove redundant code in \<usertype\>/page

## Project Dependencies

The project needs

- Chakra-UI: @chakra-ui/react @chakra-ui/icons
- react-icons/bs
- Supabase

libraries for next js installed.

## Future Enhancements

- Proper Login System with magic link and password recovery
- Responsiveness for mobile devices
- Admin room assignment capability
- User notification system to inform of any changes
- File type support - so that admin can upload csv for setting timetable

## Setting up backend

Note that the following sql is **just for reference** and was auto generated. This does not show the foreign key constraints that exist in the database

```sql
CREATE TABLE teacher (id text NOT NULL, name character varying NOT NULL, contact text, email character varying NOT NULL, priority smallint NOT NULL);

CREATE TABLE admin (id text NOT NULL, name character varying NOT NULL, contact text, email character varying NOT NULL, priority smallint NOT NULL);

CREATE TABLE timetable (timetable_id bigint NOT NULL, class text NOT NULL, day text NOT NULL, id text NOT NULL, timeslot bigint NOT NULL);

CREATE TABLE reservation (rid bigint NOT NULL, date date NOT NULL, room_no text, reason character varying NOT NULL, occupier_id character varying NOT NULL, occupier_priority smallint, timeslot bigint);

CREATE TABLE student (usn text NOT NULL, name character varying NOT NULL, contact text, email character varying NOT NULL, priority smallint NOT NULL);

CREATE TABLE time_slots (id bigint NOT NULL, start_time time without time zone NOT NULL, end_time time without time zone);

CREATE TABLE rooms (room_number text NOT NULL, class text NOT NULL, floor smallint, common_area boolean, type smallint);
```

There exist the following sql functions in the supabase project as RPCs.

RPC - check_email_exists

```sql
SELECT
    (SELECT COUNT(*) FROM teacher WHERE email = $1) = 1 OR
    (SELECT COUNT(*) FROM student WHERE email = $1) = 1 OR
    (SELECT COUNT(*) FROM admin WHERE email = $1) = 1
```

RPC - SetTimetableReservations

```sql
INSERT INTO reservation (date, room_no, reason, occupier_id, occupier_priority, timeslot)
SELECT CURRENT_DATE+7, r.room_number, ' Default Timetable Class', t.id, 2, t.timeslot
FROM timetable t, rooms r
WHERE t.class = r.class AND EXTRACT(DOW FROM (CURRENT_DATE))::text = t.day

```

**Please change the supabase ANON keys in services/client.tsx, they are committed to the repository and stored to not mess up the vercel hosting**

First time working with Next.js.
