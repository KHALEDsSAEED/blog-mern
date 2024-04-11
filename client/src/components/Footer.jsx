import React from 'react'
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';

export default function FooterCom() {
    return (
        <Footer className='border border-t-8 border-teal-500'>
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-col-1">
                    <div className="mt-5">
                        <Link to='/' className='self-center whitespace-nowrap
                        text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r text-white
                            from-indigo-500 via-purple-500 to-pink-500 rounded-lg'>
                                Khaled's
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.google.com' target='_blank' rel='noopener noreferrer'>
                                    MERN BLOG
                                </Footer.Link>
                                <Footer.Link href='https://www.google.com' target='_blank' rel='noopener noreferrer'>
                                    REACT & EXPRESS
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='https://www.google.com' target='_blank' rel='noopener noreferrer'>
                                    GITHUB
                                </Footer.Link>
                                <Footer.Link href='https://www.google.com' target='_blank' rel='noopener noreferrer'>
                                    LinkedIn
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#'>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#'>
                                    Terms and Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright href='#' by="Khaled's Blog" year={new Date().getFullYear()} />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='#' icon={BsInstagram} />
                        <Footer.Icon href='#' icon={BsGithub} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}
