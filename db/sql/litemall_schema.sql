drop user if exists 'litemall'@'%';
create user 'litemall'@'%' identified by 'litemall123456';
use litemall;
grant all privileges on litemall.* to 'litemall'@'%';
flush privileges;