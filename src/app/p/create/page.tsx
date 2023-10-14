import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { PreviewContent } from "./PreviewContent";

export default function CreatePostPage() {
  return (
    <>
      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <ScrollArea className="z-10 mt-2 h-screen bg-secondary sm:h-[calc(100vh-64px-88px)] sm:rounded-md">
          <TabsContent value="edit">
            <>
              <div className="px-4 py-4 sm:px-16">
                <div className="mb-6">
                  <Button
                    variant="outlinePrimary"
                    className="cursor-pointer bg-secondary py-4 ring-offset-background focus-within:bg-primary focus-within:text-primary-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 sm:py-6 sm:text-base"
                    asChild
                  >
                    <label htmlFor="cover-image">
                      <input
                        type="file"
                        id="cover-image"
                        className="w-[0px]"
                        accept="image/*"
                      />
                      Add a cover image
                    </label>
                  </Button>
                </div>
                <Textarea
                  className="resize-none border-transparent bg-secondary pl-0 text-3xl font-bold sm:text-5xl sm:font-extrabold"
                  placeholder="New post title here..."
                  aria-label="Post Title"
                />
              </div>
              <div className="h-full min-h-[calc(100vh-50vh)] px-4 py-8 sm:px-16">
                <Textarea
                  placeholder="Write your post content here..."
                  aria-label="Post Content"
                  className="h-full min-h-[calc(100vh-50vh)] resize-none whitespace-pre-wrap bg-background/20 text-xl"
                />
              </div>
            </>
          </TabsContent>
          <PreviewContent />
        </ScrollArea>
      </Tabs>
      <div className="fixed bottom-0 z-20 flex w-full gap-2 bg-background px-2 py-4 sm:px-0">
        <Button>Publish</Button>
        <Button variant="ghost">Save draft</Button>
      </div>
    </>
  );
}
