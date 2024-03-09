"use client"; 

import Image from "next/image";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

export default function Home() {

  const [name, setName] = useState("")
  const [disableButton, setDisableButton] = useState(true)
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if(name){
      setDisableButton(false)
    }
    else{
      setDisableButton(true)
    }
  },[name])

  async function ageApi() {
    setLoading(true)
    setError(false)
    let url = `https://api.agify.io/?name=${encodeURIComponent(name)}`

    fetch(url, {method: 'GET'})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setAge(data.age)
      genderApi()
    } )
    .catch(() => {
      setLoading(false)
      setName("")
      setError(true)
    })
  }

  async function genderApi() {
    let url = `https://api.genderize.io/?name=${encodeURIComponent(name)}`

    fetch(url, {method: 'GET'})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setGender(data.gender)
      countryApi()
    } )
    .catch(() => {
      setLoading(false)
      setName("")
      setError(true)
    })
  }

  async function countryApi() {
    let url = `https://api.nationalize.io/?name=${encodeURIComponent(name)}`

    fetch(url, {method: 'GET'})
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let countryConfig = new Intl.DisplayNames(['en'], {type: 'region'})
      let countryName:string = countryConfig.of(data.country[0].country_id)!
      setCountryCode(countryName)
      setLoading(false)
    } )
    .catch(() => {
      setLoading(false)
      setName("")
      setError(true)
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-white items-center">
      <Image
      src="/Hy_Vee_Logo.jpg"
      width={500}
      height={500}
      alt="Picture of the author"
    />

    <input name="name" placeholder="Search Name..." className="flex w-2/4 bg-slate-100 py-4 rounded-lg px-4 text-black text-lg font-sans" onChange={(val) => setName(val.target.value)} value={name} />

    <button className={`flex bg-red-600 mt-6 max-w-[250px] w-full justify-center items-center rounded-lg h-14 ${disableButton ? 'opacity-60' : 'opacity-100'}`} onClick={() => disableButton ? null : ageApi()}>
      {loading ?
            <SyncLoader color="#FFFFFF" size={12} />
            : 
            <text className="text-lg font-sans">Search</text>
      }
    </button>

    {!loading? <div className="flex flex-row justify-evenly w-2/4 mt-6" >
      {age ?<div className="flex flex-col items-center justify-center w-52 h-32 border border-gray-300 rounded-lg" >
        <text className="text-base font-sans text-black font-bold">Age</text>
        <text className="text-lg font-sans text-black">{age}</text>
      </div> : null}
      {gender ? <div className="flex flex-col items-center justify-center w-52 h-32 border border-gray-300 rounded-lg" >
        <text className="text-base font-sans text-black font-bold">Gender</text>
        <text className="text-lg font-sans text-black">{gender}</text>
      </div> : null}
      {countryCode ? <div className="flex flex-col items-center justify-center w-52 h-32 border border-gray-300 rounded-lg" >
        <text className="text-base font-sans text-black font-bold">Country</text>
        <text className="text-lg font-sans text-black">{countryCode}</text>
      </div> : null}
    </div>
    :null
    }
    {error && !loading ? <text className="text-lg font-sans text-black font-bold mt-6">Error!!</text> : null}
    </main>
  );
}
