# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/debian-9.3"
  config.vm.synced_folder ".", "/vagrant"
  config.vm.provision "shell", inline: setup
end

def setup
  <<~HEREDOC
    echo 'LC_ALL=en_US.UTF-8' >>/etc/default/locale

    curl -sL https://deb.nodesource.com/setup_8.x | bash -
    apt-get install -y nodejs
  HEREDOC
end
