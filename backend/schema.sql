drop table if exists user;
drop table if exists post;
drop table if exists reply;

create table user if not exists (
  id int (8) not null auto_increment;
);

create table if post not exists (
  id int (8) not null auto_increment;
);

create table if reply not exists (
  id int (8) not null auto_increment;
);
