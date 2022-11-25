CREATE DATABASE SERVER;

CREATE USER 'server'@'%' identified by 'password';

USE SERVER;

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD, PROCESS, REFERENCES, INDEX, ALTER, SHOW DATABASES, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EVENT, TRIGGER ON *.* TO 'server'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;

-- 사용자
CREATE TABLE tb_user (
	user_seq INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	db_type VARCHAR(10) NOT NULL, 
	host VARCHAR(100) NOT NULL, 
	port VARCHAR(5) NOT NULL,
	user_id VARCHAR(20),
	db_name VARCHAR(20) NOT NULL
);

ALTER TABLE tb_user ADD CONSTRAINT UNIQUE_TB_USER UNIQUE(
	db_type,
	host,
	user_id,
	db_name
);

-- 스캔 테이블
CREATE TABLE tb_scan (
	table_seq INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	user_seq INT NOT NULL, 
	table_name VARCHAR(50) NOT NULL,
	scan_yn enum('Y','N')NOT NULL DEFAULT 'N'
);

ALTER TABLE tb_scan ADD CONSTRAINT UNIQUE_TB_SCAN UNIQUE (
	user_seq,
	table_name
);

ALTER TABLE tb_scan ADD CONSTRAINT FK_tb_user_TO_tb_scan_1 FOREIGN KEY (
	user_seq
) REFERENCES tb_user (
	user_seq
);

-- 대표 속성 사전
CREATE TABLE tb_rep_attribute (
	rattr_seq INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	rattr_name VARCHAR(50) NOT NULL
);

ALTER TABLE tb_rep_attribute ADD CONSTRAINT UNIQUE_TB_REP_ATTRIBUTE UNIQUE (
	rattr_name
);

-- 대표 결합키 사전
CREATE TABLE tb_rep_key ( 
	rkey_seq INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	rkey_name VARCHAR(50) NOT NULL
);

ALTER TABLE tb_rep_key ADD CONSTRAINT UNIQUE_TB_REP_KEY UNIQUE (
	rkey_name
);

-- 속성
CREATE TABLE tb_attribute (
	attr_seq INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	table_seq INT NOT NULL, 
	attr_name VARCHAR(50) NOT NULL, 
	attr_type enum('N', 'C') NOT NULL, 
	d_type VARCHAR(50) NOT NULL, 
	null_num INT NULL DEFAULT 0,
	diff_num INT NULL DEFAULT 0,
	max_value INT NULL DEFAULT 0, 
	min_value INT NULL DEFAULT 0, 
	zero_num INT NULL DEFAULT 0,
	special_num INT NULL DEFAULT 0, 
	rattr_seq INT NULL,
	key_candidate enum('Y', 'N') NOT NULL DEFAULT 'N'
);

alter table tb_attribute add constraint unique_tb_attribute UNIQUE (
	table_seq,
	attr_name
);

alter table tb_attribute add constraint fk_tb_scan_to_tb_attribute_1 foreign key (
	table_seq
) references tb_scan (
	table_seq
);

alter table tb_attribute add constraint fk_tb_rep_attribute_to_tb_attribute_1 foreign key (
	rattr_seq
) references tb_rep_attribute (
	rattr_seq
);

-- 대표 결합키 매핑
CREATE TABLE tb_mapping (
	mapping_seq INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
	rkey_seq INT NOT NULL, 
	attr_seq INT NOT NULL, 
	table_seq INT NOT NULL,
	chg_yn enum('Y','N') NOT NULL DEFAULT 'N'
);

ALTER TABLE tb_mapping ADD CONSTRAINT UNIQUE_TB_MAPPING UNIQUE (
	rkey_seq,
	attr_seq,
	table_seq
); 

ALTER TABLE tb_mapping ADD CONSTRAINT FK_tb_rep_key_TO_tb_mapping_1 FOREIGN KEY (
	rkey_seq
) REFERENCES tb_rep_key ( 
	rkey_seq 
);

ALTER TABLE tb_mapping ADD CONSTRAINT FK_tb_attribute_TO_tb_mapping_1 FOREIGN KEY (
	attr_seq 
) REFERENCES tb_attribute ( 
	attr_seq 
);

ALTER TABLE tb_mapping ADD CONSTRAINT FK_tb_attribute_TO_tb_mapping_2 FOREIGN KEY (
	table_seq
) REFERENCES tb_attribute ( 
	table_seq 
); 

-- 조인결합결과
CREATE TABLE tb_join ( 
	join_seq INT NOT NULL, 
	p_join_seq INT NOT NULL, 
	a_table_seq INT NOT NULL, 
	a_attr_seq INT NOT NULL, 
	a_count INT NOT NULL, 
	b_attr_seq INT NOT NULL, 
	b_table_seq INT NOT NULL, 
	b_count INT NOT NULL, 
	rkey_seq INT NOT NULL, 
	result_count INT NOT NULL,
	state enum("DONE","KEEP","READY") NOT NULL DEFAULT "READY"
);

ALTER TABLE tb_join ADD CONSTRAINT PK_TB_JOIN PRIMARY KEY (
	join_seq,
	p_join_seq,
	a_table_seq,
	a_attr_seq
); 

ALTER TABLE tb_join ADD CONSTRAINT FK_tb_attribute_TO_tb_join_1 FOREIGN KEY (
	a_table_seq
) REFERENCES tb_attribute (
	table_seq
);

ALTER TABLE tb_join ADD CONSTRAINT FK_tb_attribute_TO_tb_join_2 FOREIGN KEY (
	a_attr_seq
) REFERENCES tb_attribute (
	attr_seq
);

ALTER TABLE tb_join ADD CONSTRAINT FK_tb_attribute_TO_tb_join_3 FOREIGN KEY (
	b_attr_seq
) REFERENCES tb_attribute (
	attr_seq
);

ALTER TABLE tb_join ADD CONSTRAINT FK_tb_attribute_TO_tb_join_4 FOREIGN KEY (
	b_table_seq
) REFERENCES tb_attribute (
	table_seq
);

ALTER TABLE tb_join ADD CONSTRAINT FK_tb_rep_key_TO_tb_join_1 FOREIGN KEY (
	rkey_seq
) REFERENCES tb_rep_key (
	rkey_seq
);
