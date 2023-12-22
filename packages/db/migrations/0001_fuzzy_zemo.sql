create table if not exists "integration"(
  "id" text primary key not null,
  "slack_url" text,
  "discord_url" text,
  "webhook_url" text
);

--> statement-breakpoint
create table if not exists "project"(
  "id" text primary key not null,
  "token" text not null,
  "name" text not null,
  "platform" text not null,
  "userId" text not null,
  "integration_id" text not null,
  "created_at" timestamp with time zone default now() not null,
  "updated_at" timestamp with time zone default now() not null
);

--> statement-breakpoint
alter table "user"
  alter column "password" set not null;

--> statement-breakpoint
do $$
begin
  alter table "project"
    add constraint "project_userId_user_id_fk" foreign key("userId") references "user"("id") on delete cascade on update no action;
exception
  when duplicate_object then
    null;
end
$$;

--> statement-breakpoint
do $$
begin
  alter table "project"
    add constraint "project_integration_id_integration_id_fk" foreign key("integration_id") references "integration"("id") on delete cascade on update no action;
exception
  when duplicate_object then
    null;
end
$$;

