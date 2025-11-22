import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | MEIDEN T&D (INDIA) LIMITED',
  description: 'Terms of use and legal information for accessing and using the MEIDEN T&D (INDIA) LIMITED website.',
};

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Home
        </Link>
        <span className="mx-2 text-gray-300">/</span>
        <span className="font-semibold text-brand-primary">Terms of Use</span>
      </nav>

      {/* Page Title */}
      <div className="mb-10 border-b border-gray-200 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-primary">
          Terms of Use
        </h1>
      </div>

      {/* 
        Main Content Area 
        'prose-brand' applies your corporate font (Verdana) and blue headings automatically.
        'max-w-none' ensures it uses the full container width.
        'text-justify' matches your original CSS requirement.
      */}
      <div className="prose-brand prose-lg max-w-none text-justify">
        
        <div className="mb-10">
          <p>
            This website is managed by MEIDEN T&D (INDIA) LIMITED (&quot;Company&quot;) or its agents for the primary purpose of offering information to our customers. When a customer utilizes this website, the Company will assume that the accessing customer has consented to the terms of use specified below (&quot;Terms of Use&quot;). If a person is unwilling to consent to the Terms of Use, such user is hereby requested to refrain from browsing this website or utilizing any services offered, such as any downloads offered on the website.
          </p>
          <p>
            The Company may from time to time change or modify a part of or all of the terms and conditions of the Terms of Use. We request that each user or customer regularly review the Terms of Use for updates. Any such modification will take effect immediately at the time the modified Terms of Use are uploaded onto this website. The Company will assume that a customer or a user has agreed to such modified Terms of Use when a customer or a user accesses or views this website upon or after such modification takes effect. When there are any separate or special conditions for utilization in regard to specific services offered on this website, such separate or special conditions shall have priority.
          </p>
        </div>

        <section className="mb-10">
          <h2>Introduction to the utilization of our website</h2>
          <p>
            In accordance with the Terms of Use, the Company will grant to our customers the right to browse this website and to view the information available therein by way of allowing access to the same and displaying the relevant information on the data terminal of a personal computer or the like at the customer&apos;s end. However, the right granted to the customer herein shall be non-exclusive and non-transferable. The customer shall be regarded as having consented to not disrupt the management of this website in any way. If a customer violates the Terms of Use, the Company will withdraw the above-mentioned right from such customer. In such case, the customer concerned shall immediately dispose of all information acquired from this website.
          </p>
        </section>

        <section className="mb-10">
          <h2>Copyright</h2>
          <p>
            Unless otherwise specified, the Company reserves the copyright to all documents and other contents presented in this website. Each user shall be aware that any action such as duplication, modification, reprint, etc. of the contents included in the website without permission from the Company is prohibited pursuant to the Copyright Act. The Company will not grant a license to any customer of any of the Company&apos;s rights in regard to copyright, patents, trademarks, and other intellectual properties belonging to the Company.
          </p>
          <p>
            When there are separate or special conditions for utilization stipulated in a particular document, such separate or special conditions shall have priority.
          </p>
        </section>

        <section className="mb-10">
          <h2>Provision of information</h2>
          <p>
            The provision of confidential information by a customer or its agents through this website is prohibited. Any information provided by a customer to the Company through this website will be accepted under the assumption that the customer concerned has consented to the Company handling such information as non-confidential information.
          </p>
          <p>
            Any information provided by a customer or its agents to the Company through this website will be accepted under the assumption that the right to utilize such information has been given to the Company on a free of charge basis, which will be irrevocable and without any limitations. However, the personal information of each customer will be handled in accordance with the &quot;Privacy Policy&quot;, to be promulgated separately.
          </p>
          <p>
            Any actions, including writing, that produces material which falls into any of the categories specified below shall be prohibited.
          </p>
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>Contents that could infringe the copyright or any other intellectual property belonging to the Company or a third party;</li>
            <li>Contents that could defame, calumniate, or threaten the Company or a third party;</li>
            <li>Contents that could be deemed to be the promotion of a business, advertisement, invitation, solicitation, etc.;</li>
            <li>Contents contrary to public order and morals;</li>
            <li>Contents that causes or could cause criminal acts or crimes; and</li>
            <li>Any other contents that could hinder the management of the website, as determined by the Company.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2>Disclaimer</h2>
          <p>
            The Company pays utmost attention to the quality of the information displayed on this website, but the Company takes no responsibility in any way for the correctness, reliability, timeliness, usefulness, and fitness for a customer&apos;s purpose of such information, nor does the Company take responsibility for the safety and the functionality of this website itself. Unless otherwise specified in the specific terms and conditions for a particular service offered on this website, the Company takes no responsibility in any way for any damages accrued by the customer in relation to the customer&apos;s utilization of this website.
          </p>
        </section>

        <section className="mb-10">
          <h2>Linkage</h2>
          <p>
            The Company shall in no way be responsible for any damages accrued by the customer in relation to the customer&apos;s utilization of a website linked to the Company&apos;s website (&quot;Link Site&quot;), or the contents acquired through the Link Site. When a customer utilizes a Link Site, the customer shall be required to comply with the terms of use stipulated by such Link Site.
          </p>
          <p>
            The presence of a link to a Link Site on this website does not imply the Company&apos;s utilization of such Link Site, nor does it imply any business relationship between the Company and the person or organization that manages the Link Site, or the merchandise or services, etc. displayed on the Link Site.
          </p>
        </section>

        <section className="mb-10">
          <h2>Linkage with this website</h2>
          <p>
            When linking to this website via a website other than the Company&apos;s website, no particular statement to report that fact to the Company is required. However, the user will be deemed to understand and agree that the Company may demand the cancelation of the link to the Company&apos;s website when the Company determines such linkage to be undesirable.
          </p>
          <p>Any linkage from a website which falls into or could fall into any of the following categories will be rejected:</p>
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>Linkage from a website that defames or calumniates the Company, its associated companies, or a third party;</li>
            <li>Linkage from a website that impairs the Company&apos;s credibility, reputation, or dignity, such as websites contrary to public order and morality;</li>
            <li>Linkage from a website that contains illegal or possibly illegal contents, or is concerned with illegal or possibly illegal activities; and</li>
            <li>Linkage that may give rise to a misconception of any possible affiliated or cooperative relationship with the Company, or a misconception that the Company is acknowledging or supporting the website containing the original linkage.</li>
          </ol>
          <p className="mt-4">
            The Company shall not be responsible in any way for any complaints, claims, or other similar petitions from a customer or a third party related to a customer website that falls into any of the above categories. Each user will hold harmless and cause no damage to the Company. The Company has promulgated a separate &quot;Privacy Policy&quot; which each customer is requested to read.
          </p>
        </section>

        <section className="mb-10">
          <h2>Utilization outside India and applicable laws</h2>
          <p>
            This website is managed and controlled within the territory of India by the Company. The Company makes no declaration or representation in regard to whether activities such as acquiring information on this website or making access available to this website are permissible, legally valid, or possible in any other country or area outside of India. The establishment, effectiveness, enforceability, fulfilment, and interpretation of the Terms of Use will be governed by the laws of India. Should any necessity for any litigation arise in regard to this website between a customer and the Company, India Court shall have exclusive jurisdiction as the court of first instance.
          </p>
          
          <h3 className="mt-6 font-bold text-brand-secondary">About the trademarks of the other companies</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Adobe and an Adobe logo are either registered trademarks or trademarks of Adobe Systems Incorporated in the United States and/or other countries.</li>
            <li>Microsoft, Windows, Windows Vista, Aero, Excel, Outlook, PowerPoint, Windows Media, a Windows logo, a Windows start logo, and an Office logo are either registered trademarks or trademarks of Microsoft Corporation in the United States and/or other countries.</li>
          </ul>
          <p className="mt-4">
            In addition, the corporate names or product names, etc. are either trade names, or trademarks or registered trademarks of the respective owners.
          </p>
          <p>
            Further, in case trademarks are individually shown in the web page of this site, the terms and conditions of the trademarks of the other companies shown here shall prevail.
          </p>
        </section>

      </div>
    </div>
  );
}