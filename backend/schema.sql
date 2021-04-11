drop table if exists user;
drop table if exists post;
drop table if exists reply;

create table if not exists user (
  user_id integer not null,
  name varchar(50) not null,
  password integer not null,
  primary key (user_id)
);

create table if not exists post (
  post_id integer not null,
  author_id integer not null,
  title text not null,
  content text,
  created_at datetime not null,
  score integer not null,
  primary key (post_id),
  foreign key (author_id) references users (user_id)
    on delete cascade
    on update no action
);

create table if not exists reply (
  reply_id integer not null,
  root_reply_id integer,
  post_id integer not null,
  body text,
  score integer,
  primary key (reply_id),
  foreign key (post_id) references post (post_id),
  foreign key (root_reply_id) references reply (reply_id)
);


insert into user (name, password) values ("test", "123");
insert into user (name, password) values ("test1", "123");

insert into post (author_id, title, content, created_at, score)
  values (1, "title", "content", DateTime('now'), 100);

insert into post (author_id, title, content, created_at, score)
  values (1, "title1", "content1", DateTime('now'), 100);


insert into reply (post_id, body, score)
  values (1, "reply1", 100);
insert into reply (root_reply_id, post_id, body, score)
  values (1, 1, "reply1-1", 100);
insert into reply (root_reply_id, post_id, body, score)
  values (1, 1, "reply1-2", 100);

insert into reply (post_id, body, score)
  values (2, "reply2", 100);
