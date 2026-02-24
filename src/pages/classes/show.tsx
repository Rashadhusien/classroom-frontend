import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails, User } from "@/types";
import { useGetIdentity, useShow } from "@refinedev/core";
import { useNavigate } from "react-router";
import { AdvancedImage } from "@cloudinary/react";
import { bannerPhoto } from "@/lib/cloudinary";
import { BookOpen } from "lucide-react";
const Show = () => {
  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const navigate = useNavigate();
  const { data: currentUser } = useGetIdentity<User>();

  const classDetails = query.data?.data;

  const { isLoading, isError } = query;

  if (isLoading || isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <p className="state-message">
          {isLoading
            ? "Loading class details..."
            : isError
            ? "Failed to load class details."
            : "No class found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 1)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA",
  )}`;

  const {
    bannerUrl,
    name,
    description,
    status,
    capacity,
    teacher,
    subject,

    bannerCldPubId,
    department,
  } = classDetails;

  return (
    <ShowView className="class-view class-show">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {bannerUrl ? (
          <AdvancedImage
            alt="class banner"
            cldImg={bannerPhoto(bannerCldPubId ?? "classroom/no-image", name)}
          />
        ) : (
          <div className="placeholder"></div>
        )}
      </div>

      <Card className="details-card">
        <div className="details-header">
          <div>
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
          <div>
            <Badge variant="outline">{capacity}</Badge>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              data-status={status}
            >
              {status && status.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="details-grid">
          <div className="instructor">
            <p>Instructor</p>
            <div>
              <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

              <div>
                <p>{teacherName}</p>
                <p>{teacher?.email}</p>
              </div>
            </div>
          </div>
          <div className="department">
            <p>Department</p>
            <div>
              <p>{department?.name}</p>
              <p>{department?.description}</p>
            </div>
          </div>
        </div>
        <Separator />

        <div className="subject">
          <p>Subject</p>
          <div className="flex flex-col gap-2">
            <Badge variant={"outline"}>Code: {subject?.code}</Badge>
            {currentUser?.role !== "student" && (
              <Badge variant={"outline"}>
                Invite Code: {classDetails.inviteCode}
              </Badge>
            )}
            <p>{subject?.name}</p>
            <p>{subject?.description}</p>
          </div>
        </div>

        <Separator />

        <div className="join">
          <h2>Class Actions</h2>
          <div className="flex flex-col gap-3">
            {(classDetails.isEnrolled ||
              (currentUser?.role === "teacher" &&
                classDetails.teacher?.id === currentUser?.id)) && (
              <Button
                size={"lg"}
                className="w-full"
                onClick={() =>
                  navigate(`/dashboard/lectures?classId=${classDetails.id}`, {
                    replace: true,
                    state: {
                      classId: classDetails.id,
                      className: classDetails.name,
                    },
                  })
                }
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {currentUser?.role === "teacher" &&
                classDetails.teacher?.id === currentUser?.id
                  ? "Create Lecture"
                  : "View Lectures"}
              </Button>
            )}

            {!classDetails.isEnrolled && currentUser?.role === "student" && (
              <Button
                size={"lg"}
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate(
                    `/dashboard/enrollments/join?classId=${classDetails.id}`,
                  )
                }
              >
                Join Class
              </Button>
            )}
          </div>

          <div className="mt-4">
            <h3>How to Join</h3>
            <ol>
              <li>Ask your Teacher for the invite code</li>
              <li>Click on "Join Class" button</li>
              <li>Paste code and click "Join"</li>
            </ol>
          </div>
        </div>
      </Card>
    </ShowView>
  );
};

export default Show;
