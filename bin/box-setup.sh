#!/bin/bash

#Check for and/or install homebrew
if which brew ; then
  echo "Brew is already installed" ;
else
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" ;
  echo "Brew successfully installed" ;
fi


#Check if node exists & is version 6 else install
NODE_V=$(node -v)

if [[ $NODE_V = v6* ]] ; then
  echo 'Node 6 is already installed and linked' ;
else
  brew install node@6 &&
  brew link node@6 --force ;
fi

#Check if npm is proper version
NPM_V=$(npm -v) ;

if [[ $NPM_V = 3* ]] ; then
  echo 'NPM 3 is already installed' ;
else
  npm install -g npm@latest-3 ;
  echo 'NPM 3 successfully installed' ;
fi

echo 'Uninstalling global npm dependencies' ;

#Uninstall all potential conflicting packages
npm uninstall -g ionic cordova ios-deploy ios-sim ;

npm install -g ionic@2 cordova@6  ios-deploy ios-sim ;
echo 'Successfully installed global dependencies' ;

echo 'Installing npm dependencies' ;
npm install ;

#Restore ionic and prepare for prod build
echo 'Building & restoring application' ;
ionic build ;
ionic state restore ;

exit 0 ;
