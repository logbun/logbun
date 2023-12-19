create table if not exists "account"(
  "userId" text not null,
  "type" text not null,
  "provider" text not null,
  "providerAccountId" text not null,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  constraint account_provider_providerAccountId_pk primary key ("provider", "providerAccountId")
);

--> statement-breakpoint
create table if not exists "session"(
  "sessionToken" text primary key not null,
  "userId" text not null,
  "expires" timestamp not null
);

--> statement-breakpoint
create table if not exists "user"(
  "id" text primary key not null,
  "name" text,
  "password" text not null,
  "email" text not null,
  "emailVerified" timestamp,
  "image" text,
  constraint "user_email_unique" unique ("email")
);

--> statement-breakpoint
create table if not exists "verificationToken"(
  "identifier" text not null,
  "token" text not null,
  "expires" timestamp not null,
  constraint verificationToken_identifier_token_pk primary key ("identifier", "token")
);

--> statement-breakpoint
do $$
begin
  alter table "account"
    add constraint "account_userId_user_id_fk" foreign key("userId") references "user"("id") on delete cascade on update no action;
exception
  when duplicate_object then
    null;
end
$$;

--> statement-breakpoint
do $$
begin
  alter table "session"
    add constraint "session_userId_user_id_fk" foreign key("userId") references "user"("id") on delete cascade on update no action;
exception
  when duplicate_object then
    null;
end
$$;

