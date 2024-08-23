FROM php:8.0.22-apache
COPY php.ini /usr/local/etc/php/

#phpのauto-prepend機能で、http/httpsのstream wrapperを削除するためのファイル
COPY php-prepend-file.php /usr/local/lib/

ARG USERNAME
ARG USER_UID
ARG USER_GID

ENV APACHE_RUN_USER $USERNAME
ENV APACHE_RUN_GROUP $USERNAME

ARG WEBROOT_HTTP
ARG WEBROOT

# Create the user
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    #
    # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
    && apt-get update \
    && apt-get install -y sudo \
    && echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

# php、Linux(debian)の必要モジュール・ライブラリをインストール

RUN apt-get update \
  && apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev libmcrypt-dev libicu-dev libjpeg-dev libzip-dev libonig-dev iputils-ping net-tools wget curl git vim locales \
  && docker-php-ext-install pdo_mysql mysqli iconv intl zip exif \
  && docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ \
  && docker-php-ext-install -j$(nproc) gd \
  && echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen \
  && locale-gen ja_JP.UTF-8 \
  && update-locale LANG=ja_JP.UTF-8

ENV LANG=ja_JP.UTF-8
ENV LC_CTYPE=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

# 必要なモジュールを有効
RUN a2enmod rewrite \
    && a2enmod headers

# DocumentRootの設定
RUN cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf.orig \
    && sed -i -e"s%/var/www/html%${WEBROOT_HTTP}%" /etc/apache2/sites-available/000-default.conf \
    && a2ensite 000-default \
    && cp /etc/apache2/apache2.conf /etc/apache2/apache2.conf.orig \
    && sed -i -e"s%/var/www%${WEBROOT}%" /etc/apache2/apache2.conf \
    && cp /etc/apache2/conf-enabled/docker-php.conf /etc/apache2/conf-enabled/docker-php.conf.orig \
    && sed -i -e"s%/var/www%${WEBROOT}%" /etc/apache2/conf-enabled/docker-php.conf

#メールをローカルで受けるためのmailhogのエージェントを入れる
RUN curl -sSLO https://github.com/mailhog/mhsendmail/releases/download/v0.2.0/mhsendmail_linux_amd64 \
    && chmod +x mhsendmail_linux_amd64 \
    && mv mhsendmail_linux_amd64 /usr/local/bin/mhsendmail

WORKDIR ${WEBROOT_HTTP}
