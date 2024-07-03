
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";
import { Link } from "react-router-dom";

export default function Component() {
    return (
        <Accordion>
            <AccordionPanel>
                <AccordionTitle>What is Dev's Blog?</AccordionTitle>
                <AccordionContent>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
                        Dev's Blog is a platform dedicated to sharing insightful and informative content about programming and development. Our community of developers and enthusiasts come together to read and discuss various topics in the tech world. Whether you're a beginner or an experienced coder, you'll find valuable resources and engaging discussions here.
                    </p>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
                <AccordionTitle>How to join us?</AccordionTitle>
                <AccordionContent>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
                        Just click on the <Link className=" text-blue-400 cursor-pointer hover:underline" to={"/sign-in"}>"Sign In"</Link> button at the top right corner of the homepage, fill out the required information, and you'll be ready to join our community.
                    </p>
                </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
                <AccordionTitle>How do I comment on a blog post?</AccordionTitle>
                <AccordionContent>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
                        <span className=" font-bold block">To comment on a blog post, you must be signed in.</span>  
                        Simply scroll to the bottom of the blog post and type your comment in the comment box. Click "Submit" to share your thoughts with the community.
                    </p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    );
}
