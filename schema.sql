set foreign_key_checks = 0;

drop table if exists permission;
drop table if exists user;
drop table if exists post;
drop table if exists image;
set foreign_key_checks = 1;


create table if not exists permission (
  id int(1) not null auto_increment,
  perm_code int(1) not null,
  perm_name varchar(5) not null,
  primary key (id)
);


insert into permission (perm_code, perm_name) values
(0, "ADMIN"),
(1, "USER"),
(2, "TOUR");


create table if not exists user (
  id int(6) not null auto_increment,
  perm_id int(1) not null,
  user_name varchar(255) not null,
  primary key (id),
  foreign key (perm_id) references permission(id)
);


create table if not exists post (
  id int(8) not null auto_increment,
  user_id int(6) not null,
  title varchar(255) not null,
  content text not null,
  primary key (id),
  foreign key (user_id) references user(id)
);


create table if not exists image (
  id int(8) not null auto_increment,
  post_id int(8) not null,
  content longblob not null,
  primary key (id),
  foreign key (post_id) references post(id)
);

