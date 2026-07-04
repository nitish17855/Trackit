import {
  boolean,
  pgTable,
  serial,
  varchar,
  timestamp,
  
  integer ,
  date,
  unique,
} from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).unique(),

  password:varchar("password " , { length:255}),
  age: integer("age"),

  weight: integer("weight"),
  createdAt: timestamp("created_at")
    .defaultNow(),
});


const exercisesTable = pgTable("exercise" , {
    id: serial("id").primaryKey(),
    exercise_name : varchar ("exercise_name" , {
        length : 300 
    }) ,
    email: varchar("email", {
    length: 255,
  }),
    equipment : varchar("equipment" , {
        length : 200
    }) ,
    body_part : varchar("body_part" , {
        length : 255
    }),
    level : varchar("level" ,{ 
        length : 250 
    })
})


const workoutTable = pgTable("workout" , {
   id: serial("id").primaryKey(),
    exercise_name : varchar ("exercise_name" , {
        length : 300 
    }) ,
       email: varchar("email", {
    length: 255,
  }),
   
    weight: integer("weight") ,
    sets: integer("set"),
    reps: integer("reps"),
    day : varchar ("day" , {
      length :20
    }) ,
    is_completed : boolean("is_completed") ,
    comment : varchar("comment" , { length : 255})
    
})

const scheduleTable = pgTable("schedule" , {
  id: serial("id").primaryKey() ,
  name: varchar("name", {
    length: 255,
  }).notNull(),
   email: varchar("email", {
    length: 255,
  }),
   createdAt: timestamp("created_at")
    .defaultNow(),
   title : varchar("tite" , { length: 300}) ,
   message : varchar("message" , { length : 400} ) ,
   is_status_pending : boolean("is_pending").default(true),
   send_email :boolean("send_email").default(false) ,
   send_browser_notification : boolean("send_notifications").default(true)  ,
   runAt: timestamp("run_at").notNull() ,
  
  })

const attendanceTable = pgTable("attendance", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  attendedOn: date("attended_on").notNull(),
  attended: boolean("attended").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  oneAttendancePerDay: unique("attendance_email_day_unique").on(table.email, table.attendedOn),
}));


export { usersTable , exercisesTable , workoutTable , scheduleTable, attendanceTable};
