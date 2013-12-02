TO INSTALL BROWSER OS:

1. install apache2 and setup a vhost pointing to the root of this project.

   the directory config for apache2 should be:

   <Directory /path/to/project/root/>
      Options All
      AllowOverride All
      Allow from all
   </Directory>

2. enable the apache2 "rewrite" module
    
    a2enmod rewrite

3. restart apache 2

4. install php5 modules:

    apt-get install \
        php5-curl \
        php5-gd \
        php5-mysql

5. install mysql, and create a database ( in this example a database called
   "browserfs" will be created )
    
    mysql > CREATE DATABASE browserfs

6. populate the database with default tables
    
        cat install/database.sql | \
        mysql --user=<your_mysql_user> \
              --password=<your_mysql_password> \
              --host=<your_mysql_host> \
              browserfs

7. restart apache
    
    /etc/init.d/apache2 restart

8. open a browser to your browser fs apache2 vhost:
    
    http://localhost/
    
9. username = "root", password="toor". enjoy