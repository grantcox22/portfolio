"use client";

import { CornerDownRight } from "lucide-react";
import { ListItem } from "../../../components/list-item";
import Link from "next/link";
import { Category, Project } from "@prisma/client";
import { ProjectDisplay } from "@/components/project";

interface HomeProps {
  projects?: (Project & {
    category: {
      name: string;
    }[];
  })[];
}

export default function Home({ projects }: HomeProps) {
  return (
    <div className="py-6 text-clip space-y-8 relative bg-gradient-to-t h-full max-h-[calc(100vh-13.25rem)] overflow-auto">
      <div className="h-40">// TODO: Add ascii art</div>

      <section className="space-y-2" id="landing">
        <h1 className="text-3xl font-bold uppercase">
          Welcome to GCox.Dev
          <span className="animate-blink font-normal">|</span>
        </h1>
        <p>
          My name is <span className="text-green-500">Grant Cox</span>, and I am
          an engineering student from St. Louis MO
          <a href="#about" className="ml-2 flex">
            <CornerDownRight className="w-4 h-4 mt-1 mr-2" />
            Read More
          </a>
        </p>
      </section>
      <section className="space-y-2" id="projects">
        <h2 className="text-2xl font-bold">01 ~/Projects</h2>
        <div className="space-y-4">
          {projects?.map((project) => (
            <ProjectDisplay key={project.id} project={project} />
          ))}
        </div>
        <Link href="/projects" className="mt-6 flex">
          <CornerDownRight className="w-4 h-4 mt-1 mr-2" />
          See More Projects
        </Link>
      </section>
      <section className="space-y-2" id="about">
        <h2 className="text-2xl font-bold">02 ~/ABOUTME.md</h2>
        <p>
          I am a student at the{" "}
          <span className="text-green-500">
            University of Missouri - Columbia
          </span>{" "}
          studying{" "}
          <span className="text-green-500">
            Electrical and Computer Engineering
          </span>
          . I work as a{" "}
          <span className="text-green-500">Lead Software Engineer</span>{" "}
          building a medical education based LMS.
        </p>
        <h3 className="text-xl font-bold">./Skills</h3>
        <ul className="border-l px-2">
          <ListItem>NextJS</ListItem>
          <ListItem>Typescript</ListItem>
          <ListItem>C, C++</ListItem>
          <ListItem>Java</ListItem>
          <ListItem>ASM</ListItem>
          <ListItem>API</ListItem>
          <ListItem>SQL</ListItem>
          <ListItem>Networking</ListItem>
          <ListItem>Data Structures</ListItem>
          <ListItem>Embedded Programming</ListItem>
          <ListItem>PCB Design</ListItem>
        </ul>
      </section>
      <section className="space-y-2" id="experience">
        <h2 className="text-2xl font-bold">03 ~/Experience</h2>
        <h3 className="text-xl font-bold">./IAME - St. Louis MO</h3>
        <div className="pl-2 border-l">
          <p>
            <span className="text-green-500">Lead Software Engineer</span>{" "}
            (December 2022 - Current)
          </p>
          <ul className="px-2">
            <ListItem>
              Led a development team of 4 people working on a custom learning
              management team
            </ListItem>
            <ListItem>
              Developed an LMS and ecommerce platform called CME GEnius with
              NextJS, Typescript and MySQL
            </ListItem>
            <ListItem>
              Integrated with multiple proprietary APIs to securely transmit
              learner data to the appropriate organizations
            </ListItem>
          </ul>
        </div>
        <h3 className="text-xl font-bold">./ApertureMedia</h3>
        <h3 className="text-xl font-bold">./UltrasoundFirst</h3>
      </section>
    </div>
  );
}
