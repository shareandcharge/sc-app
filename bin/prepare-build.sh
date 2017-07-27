#!/bin/bash

echo 'Installing npm dependencies' ;
npm install ;

#Restore ionic and prepare for prod build
echo 'Building & restoring application' ;
ionic build ;
ionic state restore ;

exit 0;
