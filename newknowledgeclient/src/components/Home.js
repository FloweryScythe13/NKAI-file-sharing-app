import React from 'react';
import Box from 'react-layout-components';
import { PageHeader } from 'react-bootstrap';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
                    <div>
                        <PageHeader>Home</PageHeader>
                        <p>Welcome to the file explorer application prototype for New Knowledge.</p>
                        
                        <p>
                            In this file explorer's directories, you will find 44 PDF documents which pertain to different aspects of 
                            information operations &amp; disinformation and which I reasonably believe could be of practical, novel use 
                            to your technical expertise as a company (meaning no historical reviews; no mainstream journalism work; 
                            no high-level think tank reports for policy wonks, save for a single RAND study included for its analytical 
                            method; and no research from Kate Starbird, David Carroll, @UsHadrons, Caroline O./@RVAWonk, Jonathan Albright, 
                            Molly McKew, the Atlantic Council's DFRLab, the political bot researchers at Oxford, Conspirador Norteño, 
                            or other well-known European/American figures in the disinformation research space - because you all follow 
                            them and know their work already). Even though these very disperse findings &amp; works have been concentrated 
                            together here for you, it's certainly still a large volume of information to process for research - moreover, 
                            many of them are original Russian texts, and though I have done and included my own manual translations for 
                            some of those texts as a start, translation is still needed for the rest of them. As such, I have prioritized 
                            what I believe are the most accessible documents into the folder "Information Warfare material / Leads on Analytical 
                            Technique Plug-and-Plays."
                            </p>

                            <p>(Jonathan, if you are reading this: You mentioned recently, in encouraging people to apply for your 
                                computational disinformation analyst position, that <a href="https://twitter.com/jonathonmorgan/status/1009080485987995648" target="_blank">"no one in the world has formal training in this type of analysis."</a> 
                                &nbsp; That observation of yours is what motivated me to select those specific texts as a reader's starting point - 
                                they offer formal analytics of varying scope that appear to be directly relevant to studying and modeling 
                                disinformation. I may not have a single, cohesive, textbook-quality tutorial on formal disinformation analysis, 
                                but these documents are probably the next best thing). 
                            </p>

                            <p>Notable documents in this small library include:</p>
                            <ul>
                                <li>
                                    Brand-new published research out of Asia &amp; Australia offering computational analysis methods/findings 
                                    that you can add to your existing stockpile of internal data analysis algorithms, 
                                    one of which was only published to Springer a few weeks ago and the other published mere days ago</li>
                                <li>
                                    A Chinese research paper from 2012 detailing a "breakthrough" theoretical framework of 
                                    an AI expert system for psychological warfare (truly an obscure, rare gem of a find) </li>
                                <li>
                                    The "Meme is the Embryo of the Narrative Illusion" book recently published by the Washington, 
                                    D.C.-based Institute for Critical Infrastructure Technology, a group &amp; author who you&nbsp;
                                    <a target="_blank" href="https://www.buzzfeed.com/craigsilverman/icit-james-scott-think-tank-fake-twitter-youtube?utm_term=.svLzn6LeDB#.uyz6VOoz54">may have seen</a> fall into <a target="_blank" href="https://www.buzzfeed.com/craigsilverman/dc-think-tank-james-scott-mcafee-centrify-fake-twitter-icit?utm_term=.qb3QbgDqnj&bftwnews#.qpA7b0vQOq" >some disrepute lately.</a> 
                                    &nbsp;This book is.... curious. As a bit of a personality psychology nerd who had previously heard of both 
                                    spiral dynamics (a.k.a. the Graves Model) and socionics from elsewhere, I've struggled to confirm some 
                                    of what Scott suggests in that book due to his scant citations - Spiral Dynamics is certainly conceptually 
                                    compatible with information warfare, rather innovatively and ingeniously so in my personal opinion, but 
                                    I have not seen this possible connection to Spiral Dynamics drawn <em>literally anywhere else,</em> even 
                                    with dedicated searching. However, my digging on websites for the Ukrainian Ministry of Communication has 
                                    found that his claim connecting socionics to information operations <em>does in fact</em> hold up. </li>
                                <li>
                                    A 2015 introductory manual written by the physicist and leading theorist S.P. Rastorguev for military information 
                                    operations &amp; psychological warfare officers about info ops on the Internet, which I manually translated to English 
                                    for you in full via Google Docs and heavy use of Google Translate (see "Translated copy of Information Operations in 
                                    the Internet - Rastorguev"), and which significantly discusses "evaluating the effectiveness of reprogramming the 
                                    subjects of information influence," "planning and modeling of information operations," and various mathematical models 
                                    pertaining to information operations (mainly using algebraic theory &amp; set theory, it seems)
                                </li>
                                <li>
                                    Scans of my personal hardcopy of Rastorguev's "Introduction to the Formal Theory of Information Warfare" booklet, 
                                    which appears to offer more detailed mathematical models but which needs to be run through OCR scanning and translated
                                </li>
                                <li>
                                    Various formal research on reflexive control theory, including two examples of rigorous mathematical solutions for controlling 
                                    the behavior of collective groups, one computational counterterrorism example from the non-malicious and civilian pioneer of 
                                    reflexive control theory (Lefebvre, now living in California) that analyzes groups reflexively, and one example that establishes 
                                    a way for reflexive control attempts to influence not just a person's decisions, but also their emotions
                                </li>
                                <li>
                                    The literal title "Modeling the Manipulation of Social Consciousness in the Political Process By Means of a Communication Field"
                                </li>
                                <li>
                                    George Pocheptsov's "Information Wars," apparently another pioneering theoretical work alongside Rastorguev's writings, which lays out 
                                    sections on "Countermeasures toolkit," "resonant communication technology," "model of resonant impact," "decision theory," "methods for 
                                    analyzing mass communication" (including propaganda analysis), and others
                                </li>
                        
                        </ul>
                        <p>Browse the document catalog to get started.</p>
                    </div>
            
        );
    }
}