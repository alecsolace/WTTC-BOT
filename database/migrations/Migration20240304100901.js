'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20240304100901 extends Migration {

  async up() {
    this.addSql('create table `data` (`key` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `value` varchar(255) not null default \'\', primary key (`key`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `guild` (`id` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `prefix` varchar(255) null, `deleted` tinyint(1) not null default false, `last_interact` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `image` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `file_name` varchar(255) not null, `base_path` varchar(255) not null default \'\', `url` varchar(255) not null, `size` int not null, `tags` text not null, `hash` varchar(255) not null, `delete_hash` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `manufacturer` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `member` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `pastebin` (`id` varchar(255) not null, `edit_code` varchar(255) not null, `lifetime` int not null default -1, `created_at` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `ship` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `manufacturer_id` int unsigned not null, `model` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ship` add index `ship_manufacturer_id_index`(`manufacturer_id`);');

    this.addSql('create table `member_ship` (`id` int unsigned not null auto_increment primary key, `member_id` int unsigned not null, `ship_id` int unsigned not null, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `member_ship` add index `member_ship_member_id_index`(`member_id`);');
    this.addSql('alter table `member_ship` add index `member_ship_ship_id_index`(`ship_id`);');

    this.addSql('create table `stat` (`id` int unsigned not null auto_increment primary key, `type` varchar(255) not null, `value` varchar(255) not null default \'\', `additional_data` json null, `created_at` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `user` (`id` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `last_interact` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `ship` add constraint `ship_manufacturer_id_foreign` foreign key (`manufacturer_id`) references `manufacturer` (`id`) on update cascade;');

    this.addSql('alter table `member_ship` add constraint `member_ship_member_id_foreign` foreign key (`member_id`) references `member` (`id`) on update cascade;');
    this.addSql('alter table `member_ship` add constraint `member_ship_ship_id_foreign` foreign key (`ship_id`) references `ship` (`id`) on update cascade;');
  }

  async down() {
    this.addSql('alter table `ship` drop foreign key `ship_manufacturer_id_foreign`;');

    this.addSql('alter table `member_ship` drop foreign key `member_ship_member_id_foreign`;');

    this.addSql('alter table `member_ship` drop foreign key `member_ship_ship_id_foreign`;');

    this.addSql('drop table if exists `data`;');

    this.addSql('drop table if exists `guild`;');

    this.addSql('drop table if exists `image`;');

    this.addSql('drop table if exists `manufacturer`;');

    this.addSql('drop table if exists `member`;');

    this.addSql('drop table if exists `pastebin`;');

    this.addSql('drop table if exists `ship`;');

    this.addSql('drop table if exists `member_ship`;');

    this.addSql('drop table if exists `stat`;');

    this.addSql('drop table if exists `user`;');
  }

}
exports.Migration20240304100901 = Migration20240304100901;
