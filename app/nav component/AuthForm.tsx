'use client'
import React, { useState } from 'react'
import { auth } from '../component/lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  
}